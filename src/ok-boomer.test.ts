import * as express from 'express';
import * as http from 'http';
import fetch from 'node-fetch';
import { okBoomer } from './ok-boomer';

describe('okBoomer', () => {
    let server: http.Server;
    afterEach(() => {
        server.close();
    })

    it('should add its message to a response with a 200 status code', () => {
        const app = express();
        app.use(okBoomer);
        app.get('/', (req, res) => res.sendStatus(200));
        server = app.listen(5000);
        
        return fetch('http://localhost:5000').then(res => {
            expect(res.statusText).toBe('OK Boomer');
            server.close();
        })
    });

    it('should not add its message to a response with any other status code', () => {
        const app = express();
        app.use(okBoomer);
        app.get('/', (req, res) => res.sendStatus(201));
        server = app.listen(5000);
        
        return fetch('http://localhost:5000').then(res => {
            expect(res.statusText).not.toBe('OK Boomer');
            server.close();
        })
    });
});