"use server";

import { cookies } from "next/headers";
import { encrypt } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function loginAction(formData: FormData) {
  const password = formData.get("password") as string;
  const adminPassword = process.env.ADMIN_PASSWORD;
  
  if (!adminPassword) {
    throw new Error("ADMIN_PASSWORD environment variable is not set");
  }

  if (password === adminPassword) {
    // Correct password
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    const sessionToken = await encrypt({ role: "admin", expires });

    const cookieStore = await cookies();
    cookieStore.set("admin_session", sessionToken, {
      expires,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    redirect("/admin");
  }

  // Incorrect password
  throw new Error("Invalid password");
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
  redirect("/admin/login");
}
