// app/provider.jsx   (or wherever this file is located)
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/services/supabaseClient";

// Better to create context here (or keep in separate file)
export const UserDetailContext = createContext(undefined);

export default function Provider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser();

        // Debug logs - keep them for now, remove later if not needed
        console.log("Full Supabase auth user:", authUser);
        console.log("user_metadata:", authUser?.user_metadata);

        if (!authUser) {
          setUser(null);
          setLoading(false);
          return;
        }

        // Check if user already exists in your Users table
        const { data: existingUsers, error: fetchError } = await supabase
          .from("Users")
          .select("*")
          .eq("email", authUser.email)
          .maybeSingle();  // .maybeSingle() is cleaner than checking length

        if (fetchError) {
          console.error("Error fetching user:", fetchError);
        }

        console.log("Existing user from DB:", existingUsers);

        if (!existingUsers) {
          // Create new user
          const displayName =
            authUser.user_metadata?.full_name ||    // Google usually sends this
            authUser.user_metadata?.name ||
            authUser.email?.split("@")[0] ||
            "Guest";

          const { data: newUser, error: insertError } = await supabase
            .from("Users")
            .insert({
              name: displayName,
              email: authUser.email,
              picture:
                authUser.user_metadata?.avatar_url ||
                authUser.user_metadata?.picture ||
                null,
            })
            .select()
            .single();

          if (insertError) {
            console.error("Insert error:", insertError);
            setUser(null);
          } else {
            console.log("New user created:", newUser);
            setUser(newUser);
          }
        } else {
          // User exists → use it (optionally update name/picture if missing)
          let updatedUser = { ...existingUsers };

          if (!existingUsers.name) {
            const newName =
              authUser.user_metadata?.full_name ||
              authUser.user_metadata?.name ||
              authUser.email?.split("@")[0] ||
              "Guest";

            const { error: updateError } = await supabase
              .from("Users")
              .update({ name: newName })
              .eq("email", authUser.email);

            if (!updateError) {
              updatedUser.name = newName;
            }
          }

          setUser(updatedUser);
        }
      } catch (err) {
        console.error("User loading failed:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();

    // Listen for auth changes (login/logout/refresh)
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth event:", event, session?.user?.email);
      if (session?.user) {
        loadUser();
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    // Cleanup
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const value = { user, setUser, loading };

  return (
    <UserDetailContext.Provider value={value}>
      {children}
    </UserDetailContext.Provider>
  );
}

// Improved custom hook with safety check
export const useUser = () => {
  const context = useContext(UserDetailContext);
  if (context === undefined) {
    throw new Error("useUser must be used inside <Provider>");
  }
  return context;
};