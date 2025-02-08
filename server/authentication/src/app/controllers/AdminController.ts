import { HttpStatus } from "../../constants/StatusConstants";
import { Messages } from "../../constants/MessageConstants";
import { NextFunction, Request, Response } from "express";
import { IAdminService } from "../../interfaces/admin/IAdminService";
import { IAdminController } from "../../interfaces/admin/IAdminController";

export class AdminController implements IAdminController {
  constructor(private _adminService: IAdminService) {}

  async getStudents(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const {
        page = 1,
        sortBy = "createdAt",
        sortOrder = 1,
        filter = '',
      } = req.query;
      const sortOption = ['firstName', 'email', 'createdAt', 'status']
      if(isNaN(Number(page))) {
        res.status(HttpStatus.BAD_REQUEST).json({error: Messages.INVALID_PAGE})
        return;
      }
      if(!sortOption.includes(String(sortBy))) {
        res.status(HttpStatus.BAD_REQUEST).json({error: Messages.INVALID_SORT_OPTION})
        return;
      }
      if(Number(sortOrder) !== 1 && Number(sortOrder) !== -1) {
        res.status(HttpStatus.BAD_REQUEST).json({error: Messages.INVALID_SORT_VALUE})
        return;
      }

      let {students, totalPages} = await this._adminService.getStudents(
        Number(page),
        String(sortBy),
        Number(sortOrder),
        filter ? String(filter) : null
      );
      
      res.status(HttpStatus.OK).json({ students, totalPages, page: Number(page) });
    } catch (err) {
      next(err);
    }
  }

  async getRecruiters(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const {
        page = 1,
        sortBy = "createdAt",
        sortOrder = 1,
        filter = ''
      } = req.query;
      const sortOption = ['companyName', 'email', 'createdAt', 'status']
      if(isNaN(Number(page))) {
        res.status(HttpStatus.BAD_REQUEST).json({error: Messages.INVALID_PAGE})
        return;
      }
      if(!sortOption.includes(String(sortBy))) {
        res.status(HttpStatus.BAD_REQUEST).json({error: Messages.INVALID_SORT_OPTION})
        return;
      }
      if(Number(sortOrder) !== 1 && Number(sortOrder) !== -1) {
        res.status(HttpStatus.BAD_REQUEST).json({error: Messages.INVALID_SORT_VALUE})
        return;
      }
      const {recruiters, totalPages} = await this._adminService.getRecruiters(
        Number(page),
        String(sortBy),
        Number(sortOrder),
        filter ? String(filter) : null
      );
      res.status(HttpStatus.OK).json({ recruiters, totalPages, page: Number(page) });
    } catch (err) {
      next(err);
    }
  }

  async blockOrUnblockUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const {userId, block} = req.body
      if(block === undefined || userId === undefined) {
        res.status(HttpStatus.BAD_REQUEST).json({error: Messages.INCOMPLETE_FORM})
        return;
      }
      
      const success = await this._adminService.blockOrUnblockUser(userId, block)
      if(success) res.status(HttpStatus.OK).json({message: block ? Messages.BLOCKED : Messages.UNBLOCKED})
    } catch (err) {
      next(err);
    }
  }
}
