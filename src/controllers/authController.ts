import { Request, Response } from "express";
import { comparePasswords, hashPassword } from "../services/password.service";
import prisma from "../models/user";
import { generateToken } from "../services/auth.service";

export const register = async ( req: Request, res: Response ): Promise<void> => {

    const { email, password } = req.body;

    try {

        if(!password){
            res.status(400).json('Password is required');
            return
        } 
        if(!email) {
            res.status(400).json('Email is required');
            return
        }

        const hashedPassword = await hashPassword(password);
        console.log(hashPassword);

        const user = await prisma.create(
            {
                data: {
                    email,
                    password: hashedPassword
                }
            }
        )

        const token = generateToken(user);
        res.status(201).json({token});
        
    }catch(error: any){

        if(error?.code === 'P2002' && error?.meta?.target?.includes('email')){
            res.status(400).json({error: "Email already exists"});
        }

        console.log(error)
        res.status(500).json({error: "Something went wrong"});

    }

}

export const login = async ( req: Request, res: Response ): Promise<void> => {

    const { email, password } = req.body;
    try {

        if(!password){
            res.status(400).json('Password is required');
            return
        } 
        if(!email) {
            res.status(400).json('Email is required');
            return
        }

        const user = await prisma.findUnique({where : {email}})
        if(!user){
            res.status(400).json({error: "User not found"});
            return 
        }

        const passwordMatch = await comparePasswords(password, user.password);

        if(!passwordMatch){
            res.status(400).json({error: "Incorrect password"});
            return
        }

        const token = generateToken(user);
        res.status(200).json({token});

    }catch(error){

        console.log(error)

    }

}   