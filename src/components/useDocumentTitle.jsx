import { useEffect } from "react";

function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title + " - Hendrix Archive FC | Hendrix Archive ";
  }, [title]); // Re-run the effect when the title changes
}

export default useDocumentTitle;
