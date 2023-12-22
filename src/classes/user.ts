import prisma from '../utils/database';
import bcrypt from "bcrypt";
import { Roleuser } from '@prisma/client';

export class User {
    id: number;
    name: string;
    email: string;
    password: string;
    roleuser: Roleuser;
    active: boolean;

    constructor(id: number, name: string, email: string, password: string, roleuser: Roleuser, active: boolean) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.roleuser = roleuser;
        this.active = active;
    }

    public static async getAllUsers(): Promise<User[]> {
        try {
            return await prisma.user.findMany({
                where: {
                    active: true,
                },
            });
        } catch (error) {
            console.error("Error fetching users:", error);
            throw new Error("Failed to fetch users");
        }
    }
    public static async getUser(userId: number): Promise<User | null> {
        try {
            const existingUser = await prisma.user.findUnique({
                where: {
                    id: userId,
                    active: true,
                },
            });
            if (existingUser) {
                const encryptdPassword = await bcrypt.hash(existingUser.password, 10);
                return {
                    id: existingUser.id,
                    name: existingUser.name,
                    roleuser: existingUser.roleuser,
                    email: existingUser.email,
                    password: encryptdPassword,
                    active: existingUser.active
                };
            } else {
                console.error(`User with ID ${userId} not found.`);
                return null;
            }
        } catch (error) {
            console.error("Error creating user:", error);
            throw new Error("Failed to create user");
        }
    }
    public static async createUser(name: string, email: string, password: string, roleuser: Roleuser): Promise<User> {
        try {
            const encryptdPassword = await bcrypt.hash(password, 10);
            const newUser = await prisma.user.create(
                {
                    data: {
                        name: name,
                        email: email,
                        roleuser: roleuser,
                        active: true,
                        password: encryptdPassword,
                    }
                });
            return {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                roleuser: newUser.roleuser,
                password: encryptdPassword,
                active: newUser.active
            };
        } catch (error) {
            console.error("Error creating user:", error);
            throw new Error("Failed to create user");
        }
    }
    public static async updateUser(id: number, name: string, email: string, password: string, roleuser: Roleuser, active: boolean): Promise<User | null> {
        try {
            const existingUser = await prisma.user.findUnique({
                where: {
                    id: id,
                },
            });
            if (existingUser) {
                const encryptdPassword = await bcrypt.hash(password, 10);
                const updatedUser = await prisma.user.update({
                    where: {
                        id: id,
                    },
                    data: {
                        name: name,
                        email: email,
                        roleuser: roleuser,
                        password: encryptdPassword,
                        active: active,
                    },
                });
                return {
                    id: updatedUser.id,
                    name: updatedUser.name,
                    roleuser: updatedUser.roleuser,
                    email: updatedUser.email,
                    password: encryptdPassword,
                    active: updatedUser.active,
                };
            } else {
                console.error(`User with ID ${id} not found.`);
                return null;
            }
        } catch (error) {
            console.error("Error updating user:", error);
            throw new Error("Failed to update user");
        }
    }
    public static async deleteUser(userId: number): Promise<void> {
        try {
            const user = await prisma.user.findUnique({
                where: {
                    id: userId,
                },
            });
            if (user) {
                await prisma.user.delete({
                    where: {
                        id: user.id,
                    },
                });
            } else {
                console.error(`User with ID ${userId} not found.`);
            }
        } catch (error) {
            console.error("Error deleting user:", error);
            throw new Error("Failed to delete user");
        }
    }
}