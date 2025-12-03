import React from "react";
import { useLocation } from "react-router-dom";

function useQuery() {
  const { search } = useLocation();
  return new URLSearchParams(search).get("q") || "";
}

export default function SearchResults() {
  const q = useQuery();
  return (
    <div style={{ padding: 24 }}>
      <h2>Results for: “{q}”</h2>
      {/* TODO: Render real results list here */}
      <p>Hook up your API/filter logic using the query above.</p>
    </div>
  );
}
