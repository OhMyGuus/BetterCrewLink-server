import express from 'express';
import { Server } from 'http';
import { Server as HttpsServer } from 'https';
import { readFileSync } from 'fs';
import { join } from 'path';
import socketIO from 'socket.io';
import Tracer from 'tracer';
import morgan from 'morgan';
import crypto from 'crypto';
import peerConfig from './peerConfig';
import { ICEServer } from './ICEServer';
let TurnServer = require('node-turn');

const httpsEnabled = !!process.env.HTTPS;

const port = process.env.PORT || (httpsEnabled ? '443' : '9736');

const sslCertificatePath = process.env.SSLPATH || process.cwd();

const logger = Tracer.colorConsole({
	format: '{{timestamp}} <{{title}}> {{message}}',
});

const turnLogger = Tracer.colorConsole({
	format: '{{timestamp}} <{{title}}> <ice> {{message}}',
	level: peerConfig.integratedRelay.debugLevel.toLowerCase(),
});

const app = express();
let server: HttpsServer | Server;
if (httpsEnabled) {
	server = new HttpsServer(
		{
			key: readFileSync(join(sslCertificatePath, 'privkey.pem')),
			cert: readFileSync(join(sslCertificatePath, 'fullchain.pem')),
		},
		app
	);
} else {
	server = new Server(app);
}

let turnServer: any | null = null;
if (peerConfig.integratedRelay.enabled) {
	turnServer = new TurnServer({
		listeningIps: peerConfig.integratedRelay.listeningIps,
		relayIps: peerConfig.integratedRelay.relayIps,
		externalIps: peerConfig.integratedRelay.externalIps,
		minPort: peerConfig.integratedRelay.minPort,
		maxPort: peerConfig.integratedRelay.maxPort,
		listeningPort: peerConfig.integratedRelay.listeningPort,
		authMech: 'long-term',
		debugLevel: peerConfig.integratedRelay.debugLevel,
		realm: 'crewlink',
		debug: (level: string, message: string) => {
			turnLogger[level.toLowerCase()](message);
		},
	});

	turnServer.addUser(peerConfig.integratedRelay.defaultUsername, peerConfig.integratedRelay.defaultPassword);

	turnServer.start();
}

const io = socketIO(server);

const clients = new Map<string, Client>();

interface Client {
	playerId: number;
	clientId: number;
}

interface Signal {
	data: string;
	to: string;
}

interface ClientPeerConfig {
	forceRelayOnly: boolean;
	iceServers: ICEServer[];
}

app.set('view engine', 'pug');
app.use(morgan('combined'));
app.use('/public', express.static('public'))

let connectionCount = 0;
let hostname = process.env.HOSTNAME;
if (!hostname && peerConfig.integratedRelay.enabled) {
	logger.error('You must set the HOSTNAME environment variable to use the TURN server.');
	process.exit(1);
}

app.get('/', (req, res) => {
	let address = req.protocol + '://' + req.headers.host;
	res.render('index', { connectionCount, address });
});

app.get('/health', (req, res) => {
	let address = req.protocol + '://' + req.headers.host;
	res.json({
		uptime: process.uptime(),
		connectionCount,
		address,
		name: process.env.NAME,
	});
});



io.on('connection', (socket: socketIO.Socket) => {
	connectionCount++;
	logger.info('Total connected: %d', connectionCount);
	let code: string | null = null;

	const clientPeerConfig: ClientPeerConfig = {
		forceRelayOnly: peerConfig.forceRelayOnly,
		iceServers: peerConfig.iceServers ? [...peerConfig.iceServers] : [],
	};

	if (turnServer) {
		//	const turnCredential = crypto.randomBytes(32).toString('base64');
		//	turnServer.addUser(socket.id, turnCredential);
		// logger.info(`Adding socket "${socket.id}" as TURN user.`);
		clientPeerConfig.iceServers.push({
			urls: `turn:${hostname}:${peerConfig.integratedRelay.listeningPort}`,
			username: peerConfig.integratedRelay.defaultUsername,
			credential: peerConfig.integratedRelay.defaultPassword,
		});
	}

	socket.emit('clientPeerConfig', clientPeerConfig);

	socket.on('join', (c: string, id: number, clientId: number) => {
		if (typeof c !== 'string' || typeof id !== 'number' || typeof clientId !== 'number') {
			socket.disconnect();
			logger.error(`Socket %s sent invalid join command: %s %d %d`, socket.id, c, id, clientId);
			return;
		}

		let otherClients: any = {};
		if (io.sockets.adapter.rooms[c]) {
			let socketsInLobby = Object.keys(io.sockets.adapter.rooms[c].sockets);
			for (let s of socketsInLobby) {
				// if (clients.has(s) && clients.get(s).clientId === clientId) {
				// 	socket.disconnect();
				// 	logger.error(`Socket %s sent invalid join command, attempted spoofing another client`);
				// 	return;
				// }
				if (s !== socket.id) otherClients[s] = clients.get(s);
			}
		}
		code = c;
		socket.join(code);
		socket.to(code).broadcast.emit('join', socket.id, {
			playerId: id,
			clientId: clientId === Math.pow(2, 32) - 1 ? null : clientId,
		});
		socket.emit('setClients', otherClients);
	});

	socket.on('id', (id: number, clientId: number) => {
		if (typeof id !== 'number' || typeof clientId !== 'number') {
			socket.disconnect();
			logger.error(`Socket %s sent invalid id command: %d %d`, socket.id, id, clientId);
			return;
		}
		let client = clients.get(socket.id);
		if (client != null && client.clientId != null && client.clientId !== clientId) {
			socket.disconnect();
			logger.error(`Socket %s sent invalid id command, attempted spoofing another client`);
			return;
		}
		client = {
			playerId: id,
			clientId: clientId === Math.pow(2, 32) - 1 ? null : clientId,
		};
		clients.set(socket.id, client);
		socket.to(code).broadcast.emit('setClient', socket.id, client);
	});

	socket.on('leave', () => {
		if (code) {
			socket.leave(code);
			clients.delete(socket.id);
		}
	});

	socket.on('signal', (signal: Signal) => {
		if (typeof signal !== 'object' || !signal.data || !signal.to || typeof signal.to !== 'string') {
			socket.disconnect();
			logger.error(`Socket %s sent invalid signal command: %j`, socket.id, signal);
			return;
		}
		const { to, data } = signal;
		io.to(to).emit('signal', {
			data,
			from: socket.id,
		});
	});

	socket.on('disconnect', () => {
		clients.delete(socket.id);
		connectionCount--;
		logger.info('Total connected: %d', connectionCount);

		// if (turnServer) {
		// 	logger.info(`Removing socket "${socket.id}" as TURN user.`);
		// 	turnServer.removeUser(socket.id);
		// }
	});
});

server.listen(port);
logger.info('CrewLink Server started: 127.0.0.1:%s', port);
