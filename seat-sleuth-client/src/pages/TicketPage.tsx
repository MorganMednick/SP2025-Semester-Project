import { TicketMasterResponse } from "@shared/api/ticketMasterResponse";
import { useState } from "react";

export default function TicketPage() {
  const [loading, setLoading] = useState<boolean>(false);

  const fetchTicketData = async (): Promise<void> => {
    setLoading(true);
    const API_KEY: string = "cmtAt6aY2NgARV2FksRnE42AY2Hy3mmA";
    const url: string = `https://app.ticketmaster.com/discovery/v2/events.json?size=1&apikey=${API_KEY}`;

    try {
      const response: Response = await fetch(url);
      const data: TicketMasterResponse | undefined = await response.json();
      console.log(data); //To check the ticket info
    } catch (error) {
      console.error("Error fetching ticket data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>I am the Ticket page</h1>
      <button onClick={fetchTicketData} disabled={loading}>
        {loading ? "Loading..." : "Check Ticket"}
      </button>
    </div>
  );
}