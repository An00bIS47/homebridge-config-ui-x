import { Router, Request, Response, NextFunction } from 'express';

import { hb } from '../hb';
import { pm } from '../pm';

export class PackageRouter {
  public router: Router;

  constructor() {
    this.router = Router();

    this.router.get('/', this.getPackages);
    this.router.put('/update', this.updatePackage);
    this.router.post('/uninstall', this.uninstallPackage);
    this.router.post('/install', this.installPackage);
    this.router.get('/homebridge', this.getHomebridgePackage);
    this.router.put('/homebridge/upgrade', this.upgradeHomebridgePackage);
  }

  getPackages(req: Request, res: Response, next: NextFunction) {
    if (req.query.search && req.query.search !== '') {
      return pm.searchRegistry(req.query.search)
        .then(pkgs => {
          res.json(pkgs);
        })
        .catch(next);
    } else {
      return pm.getInstalled()
        .then(pkgs => {
          res.json(pkgs);
        })
        .catch(next);
    }
  }

  updatePackage(req: Request, res: Response, next: NextFunction) {
    return pm.updatePlugin(req.body.package)
      .then(() => {
        hb.log('Package ' + req.body.package + ' upgraded.');
        res.json({ ok: true });
      })
      .catch(next);
  }

  uninstallPackage(req: Request, res: Response, next: NextFunction) {
    return pm.removePlugin(req.body.package)
      .then(() => {
        hb.log('Package ' + req.body.package + ' removed.');
        res.json({ ok: true });
      })
      .catch(next);
  }

  installPackage(req: Request, res: Response, next: NextFunction) {
    return pm.installPlugin(req.body.package)
      .then(() => {
        hb.log('Package ' + req.body.package + ' installed.');
        res.json({ ok: true });
      })
      .catch(next);
  }

  getHomebridgePackage(req: Request, res: Response, next: NextFunction) {
    return pm.getHomebridge()
      .then(server => res.json(server))
      .catch(next);
  }

  upgradeHomebridgePackage(req: Request, res: Response, next: NextFunction) {
    pm.updateHomebridge()
      .then(() => {
        hb.log('Homebridge server upgraded.');
        res.json({ ok: true });
      })
      .catch(next);
  }

}
