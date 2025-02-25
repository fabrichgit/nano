import { Request, Response, NextFunction } from 'express';
import { injectScript } from '../utils/htmlUtils';

export function injectHeaderScript(req: Request, res: Response, next: NextFunction) {
  const originalSend = res.send;

  res.send = function(body) {
    if (typeof body === 'string' && body.toLowerCase().includes('<!doctype html>')) {
      body = injectScript(body);
    }
    return originalSend.call(this, body);
  };

  next();
}