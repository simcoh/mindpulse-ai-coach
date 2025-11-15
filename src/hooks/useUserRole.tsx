import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useUserRole = (userId: string | undefined) => {
  const [role, setRole] = useState<"admin" | "employee" | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchRole = async () => {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .single();

      if (error) {
        console.error("Error fetching role:", error);
        setRole("employee");
      } else {
        setRole(data?.role || "employee");
      }
      setLoading(false);
    };

    fetchRole();
  }, [userId]);

  return { role, loading, isAdmin: role === "admin" };
};
