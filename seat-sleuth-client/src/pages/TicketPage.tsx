import { useState } from "react";
import { requestTicketMaster } from "../api/functions/ticketMaster";

export default function TicketPage() {
  const [loading, setLoading] = useState<boolean>(false);
  const [res, setRes] = useState<any>({});

  const fetchTicketData = async (): Promise<void> => {
    setLoading(true);
    requestTicketMaster()
    .then(res => setRes(res))
    .catch(err => console.error(err));
    
  };

  return (
    <div>
      <h1>I am the Ticket page</h1>
      <button onClick={fetchTicketData} disabled={loading}>
        {loading ? "Loading..." : "Check Ticket"}
        {res && <p>{JSON.stringify(res)}</p>}
      </button>
    </div>
  );
}//checkout a pr and resolve merge conf on github physically.

//