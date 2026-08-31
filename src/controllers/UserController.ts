import { Request, Response } from "express";
import { AppDataSource } from "../database/data-source";
import { User } from "../entities/User";
import { CreateUserDto } from "../dtos/CreateUserDto";
import { comparePassword, hashPassword } from "../utils/password";
import { LoginUserDto } from "../dtos/LoginUserDto";
import { generateToken } from "../utils/jwt";

export class UserController {
  async create(req: Request, res: Response): Promise<Response> {
    const createUserDto = req.body as CreateUserDto;

    const userRepository = AppDataSource.getRepository(User);

    const user = userRepository.create({
      ...createUserDto,
      password: await hashPassword(createUserDto.password),
    });

    const savedUser = await userRepository.save(user);

    const { password: _password, ...userWithoutPassword } = savedUser;
    return res.status(201).json(userWithoutPassword);
  }

  async login(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body as LoginUserDto;

    const userRepository = AppDataSource.getRepository(User);

    const user = await userRepository.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: "Incorrect credentials" });
    }

    if (!(await comparePassword(password, user.password))) {
      return res.status(401).json({ message: "Incorrect credentials" });
    }

    const token = generateToken({ id: user.id });

    const { password: _password, ...userWithoutPassword } = user;

    return res.status(200).json({ token, userWithoutPassword });
  }
}
