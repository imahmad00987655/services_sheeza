import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useCallback } from "react";
import { QRCodeSVG } from "qrcode.react";
import { motion } from "framer-motion";
import { Download, Printer, Copy, Check } from "lucide-react";

export const Route = createFileRoute("/admin/qrcode")({
  component: AdminQRCode,
});

function AdminQRCode() {
  const [copied, setCopied] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  // Use current origin for the portal URL
  const portalUrl =
    typeof window !== "undefined" ? window.location.origin : "https://sheezasalon.com";

  const handleDownload = useCallback(() => {
    if (!qrRef.current) return;
    const svg = qrRef.current.querySelector("svg");
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      canvas.width = 512;
      canvas.height = 512;
      if (ctx) {
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, 512, 512);
        ctx.drawImage(img, 0, 0, 512, 512);
      }
      const pngUrl = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = pngUrl;
      a.download = "sheeza-salon-qr.png";
      a.click();
    };
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  }, []);

  const handlePrint = useCallback(() => {
    const printWin = window.open("", "_blank");
    if (!printWin || !qrRef.current) return;
    const svg = qrRef.current.querySelector("svg");
    if (!svg) return;
    printWin.document.write(`
      <html><head><title>Sheeza Salon QR Code</title>
      <style>body{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;font-family:Georgia,serif;}</style>
      </head><body>
      <h1 style="margin-bottom:8px;">Sheeza Salon</h1>
      <p style="margin-bottom:24px;color:#888;">Scan to view our services</p>
      ${svg.outerHTML}
      <p style="margin-top:16px;font-size:12px;color:#aaa;">${portalUrl}</p>
      </body></html>
    `);
    printWin.document.close();
    printWin.print();
  }, [portalUrl]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(portalUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [portalUrl]);

  return (
    <div className="p-6 md:p-8">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-foreground">QR Code</h1>
        <p className="text-sm text-muted-foreground">Share this QR code with your customers</p>
      </div>

      <div className="max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-card border border-border rounded-2xl p-8 text-center shadow-rose"
        >
          <div ref={qrRef} className="inline-block p-4 bg-background rounded-2xl mb-6">
            <QRCodeSVG
              value={portalUrl}
              size={220}
              level="H"
              fgColor="#3d2520"
              bgColor="transparent"
            />
          </div>
          <h3 className="font-display text-lg font-bold text-foreground mb-1">
            Scan to Book Services
          </h3>
          <p className="text-xs text-muted-foreground mb-6">
            Customers can scan this code to browse services and book appointments
          </p>

          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-muted mb-4">
            <span className="flex-1 text-xs text-muted-foreground truncate">{portalUrl}</span>
            <button
              onClick={handleCopy}
              className="w-8 h-8 rounded-lg bg-card flex items-center justify-center text-foreground hover:bg-accent transition-colors shrink-0"
            >
              {copied ? <Check className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleDownload}
              className="flex-1 py-3 rounded-xl gradient-rose text-primary-foreground text-sm font-medium shadow-rose flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" /> Download PNG
            </button>
            <button
              onClick={handlePrint}
              className="flex-1 py-3 rounded-xl border border-border bg-card text-foreground text-sm font-medium hover:bg-accent transition-colors flex items-center justify-center gap-2"
            >
              <Printer className="w-4 h-4" /> Print
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
