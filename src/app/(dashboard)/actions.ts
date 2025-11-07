"use server";

import { revalidatePath } from "next/cache";
import {
  PrismaClient,
  UserType as PrismaUserType,
} from "../generated/prisma/client";
import { UserType, CreateUserInput, UpdateUserInput } from "@/src/types/user";

const prisma = new PrismaClient();

export type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  age: number | null;
  cpf: string;
  cep: string;
  address: string;
  complement: string | null;
  type: PrismaUserType;
  consultantId: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type UserWithRelations = User & {
  consultant?: {
    id: string;
    name: string;
    email: string;
  } | null;
  clients?: {
    id: string;
    name: string;
    email: string;
  }[];
};

/**
 * Get all users with optional filtering by type
 */
export async function getUsers(type?: UserType): Promise<UserWithRelations[]> {
  try {
    const users = await prisma.user.findMany({
      where: type ? { type: type as PrismaUserType } : undefined,
      include: {
        consultant: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        clients: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error("Failed to fetch users");
  }
}

/**
 * Get a single user by ID
 */
export async function getUserById(
  id: string
): Promise<UserWithRelations | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        consultant: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        clients: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return user;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw new Error("Failed to fetch user");
  }
}

/**
 * Get all consultants (users with type CONSULTANT)
 */
export async function getConsultants() {
  try {
    const consultants = await prisma.user.findMany({
      where: { type: PrismaUserType.CONSULTANT },
      include: {
        clients: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    return consultants;
  } catch (error) {
    console.error("Error fetching consultants:", error);
    throw new Error("Failed to fetch consultants");
  }
}

/**
 * Create a new user
 */
export async function createUser(data: CreateUserInput) {
  try {
    // Validate that if consultantId is provided, the consultant exists and is of type CONSULTANT
    if (data.consultantId) {
      const consultant = await prisma.user.findUnique({
        where: { id: data.consultantId },
      });

      if (!consultant) {
        throw new Error("Consultant not found");
      }

      if (consultant.type !== PrismaUserType.CONSULTANT) {
        throw new Error("The specified user is not a consultant");
      }
    }

    // Validate that if type is CLIENT and no consultantId, warn or handle accordingly
    if (data.type === UserType.CLIENT && !data.consultantId) {
      console.warn("Creating a client without a consultant");
    }

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        age: data.age,
        cpf: data.cpf,
        cep: data.cep,
        address: data.address,
        complement: data.complement,
        type: data.type as PrismaUserType,
        consultantId: data.consultantId,
      },
      include: {
        consultant: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    revalidatePath("/");
    return { success: true, data: user };
  } catch (error) {
    console.error("Error creating user:", error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to create user" };
  }
}

/**
 * Update an existing user
 */
export async function updateUser(data: UpdateUserInput) {
  try {
    const { id, ...updateData } = data;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      throw new Error("User not found");
    }

    // Validate consultant if consultantId is being updated
    if (updateData.consultantId !== undefined) {
      if (updateData.consultantId) {
        const consultant = await prisma.user.findUnique({
          where: { id: updateData.consultantId },
        });

        if (!consultant) {
          throw new Error("Consultant not found");
        }

        if (consultant.type !== PrismaUserType.CONSULTANT) {
          throw new Error("The specified user is not a consultant");
        }
      }
    }

    const user = await prisma.user.update({
      where: { id },
      data: {
        ...updateData,
        type: updateData.type ? (updateData.type as PrismaUserType) : undefined,
      },
      include: {
        consultant: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        clients: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    revalidatePath("/");
    return { success: true, data: user };
  } catch (error) {
    console.error("Error updating user:", error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to update user" };
  }
}

/**
 * Delete a user
 */
export async function deleteUser(id: string) {
  try {
    // Check if user has clients (if they're a consultant)
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        clients: true,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    if (user.clients.length > 0) {
      throw new Error(
        "Cannot delete consultant with active clients. Please reassign or delete clients first."
      );
    }

    await prisma.user.delete({
      where: { id },
    });

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error deleting user:", error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to delete user" };
  }
}

/**
 * Get clients for a specific consultant
 */
export async function getClientsByConsultant(consultantId: string) {
  try {
    const clients = await prisma.user.findMany({
      where: {
        consultantId,
        type: PrismaUserType.CLIENT,
      },
      orderBy: {
        name: "asc",
      },
    });

    return clients;
  } catch (error) {
    console.error("Error fetching clients:", error);
    throw new Error("Failed to fetch clients");
  }
}
