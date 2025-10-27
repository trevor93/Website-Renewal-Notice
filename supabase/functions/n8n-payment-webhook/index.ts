import { createClient } from "@supabase/supabase-js";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const body = await req.json();
    const { domain, payment_status, payment_date } = body;

    if (!domain) {
      return new Response(
        JSON.stringify({ error: "Domain is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const updateData: any = {};
    
    if (payment_status) {
      updateData.payment_status = payment_status;
      
      if (payment_status === "paid") {
        const { data: clientData } = await supabase
          .from("clients")
          .select("manual_override")
          .eq("domain_name", domain)
          .maybeSingle();

        if (!clientData?.manual_override) {
          updateData.site_active = true;
        }
      } else if (payment_status === "unpaid") {
        const { data: clientData } = await supabase
          .from("clients")
          .select("manual_override")
          .eq("domain_name", domain)
          .maybeSingle();

        if (!clientData?.manual_override) {
          updateData.site_active = false;
        }
      }
    }

    if (payment_date) {
      updateData.payment_date = payment_date;
    }

    const { data, error } = await supabase
      .from("clients")
      .update(updateData)
      .eq("domain_name", domain)
      .select();

    if (error) {
      throw error;
    }

    if (!data || data.length === 0) {
      return new Response(
        JSON.stringify({ error: "Client not found" }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Client updated successfully",
        client: data[0]
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
