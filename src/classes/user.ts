import prisma from '../utils/database';
import bcrypt from "bcrypt";

export class User {
    id: number;
    name: string;
    email: string;
    password: string;
    active: boolean;

    constructor(id: number, name: string, email: string, password: string, active: boolean) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.active = active;
    }

    public static async getAllUsers(): Promise<User[]> {
        try {
            const users = await prisma.user.findMany({
                where: {
                    active: true,
            }});
            return users.map((user) => ({
                id: user.id,
                name: user.name,
                email: user.email,
                password: user.password,
                active: user.active
            }));
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
    public static async createUser(name: string, email: string, password: string): Promise<User> {
        try {
            const encryptdPassword = await bcrypt.hash(password, 10);
            const newUser = await prisma.user.create(
                {
                    data: {
                        name: name,
                        email: email,
                        active: true,
                        password: encryptdPassword,
                    }
                });
            return {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                password: encryptdPassword,
                active: newUser.active
            };
        } catch (error) {
            console.error("Error creating user:", error);
            throw new Error("Failed to create user");
        }
    }
    public static async updateUser(id: number, name: string, email: string, password: string,active: boolean): Promise<User | null> {
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
                        password: encryptdPassword,
                        active: active,
                    },
                });
                return {
                    id: updatedUser.id,
                    name: updatedUser.name,
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