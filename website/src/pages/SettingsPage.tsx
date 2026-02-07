import { useState } from "react";
import { clearAllData, initializeData } from "@/lib/dataStore";
import { Button } from "@/components/ui/button";
import { Trash2, RefreshCw, CheckCircle } from "lucide-react";

export default function SettingsPage() {
  const [cleared, setCleared] = useState(false);

  const handleClear = async () => {
    clearAllData();
    await initializeData();
    setCleared(true);
    setTimeout(() => setCleared(false), 3000);
  };

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Settings</h2>
        <p className="text-sm text-muted-foreground">
          Manage local data and preferences
        </p>
      </div>

      <div className="rounded-lg border border-border bg-card p-5 space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-card-foreground">
            Clear All Local Data
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            This will remove all scan history from localStorage and reload the
            initial demo data. This action cannot be undone.
          </p>
        </div>

        <Button
          variant="destructive"
          onClick={handleClear}
          className="gap-2"
          disabled={cleared}
        >
          {cleared ? (
            <>
              <CheckCircle className="h-4 w-4" /> Data Reset Successfully
            </>
          ) : (
            <>
              <Trash2 className="h-4 w-4" /> Clear & Reset Data
            </>
          )}
        </Button>
      </div>

      <div className="rounded-lg border border-border bg-card p-5 space-y-3">
        <h3 className="text-sm font-semibold text-card-foreground">About</h3>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>
            <span className="font-medium text-card-foreground">PhishLens</span>{" "}
            is a phishing detection visualization dashboard. It reads analysis
            results from browser localStorage and displays them in an
            easy-to-understand format.
          </p>
          <p>
            This is a demo/expo project. All data shown is simulated and stored
            locally in your browser.
          </p>
        </div>
      </div>
    </div>
  );
}
