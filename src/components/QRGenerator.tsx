import { useEffect, useMemo, useRef, useState, ChangeEvent } from "react";
import QRCodeStyling, {
  DotType,
  CornerSquareType,
  CornerDotType,
  Options,
} from "qr-code-styling";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import {
  Download,
  Image as ImageIcon,
  Link as LinkIcon,
  Palette,
  Shapes,
  Sparkles,
  Trash2,
  Wifi,
  Mail,
  Phone,
  MessageSquare,
  Type,
} from "lucide-react";

type QRType = "url" | "text" | "email" | "phone" | "sms" | "wifi";

const dotStyles: { value: DotType; label: string }[] = [
  { value: "square", label: "Square" },
  { value: "rounded", label: "Rounded" },
  { value: "dots", label: "Dots" },
  { value: "classy", label: "Classy" },
  { value: "classy-rounded", label: "Classy Rounded" },
  { value: "extra-rounded", label: "Extra Rounded" },
];

const cornerSquareStyles: { value: CornerSquareType; label: string }[] = [
  { value: "square", label: "Square" },
  { value: "dot", label: "Dot" },
  { value: "extra-rounded", label: "Extra Rounded" },
];

const cornerDotStyles: { value: CornerDotType; label: string }[] = [
  { value: "square", label: "Square" },
  { value: "dot", label: "Dot" },
];

const presets = [
  { name: "Midnight", fg: "#0F172A", bg: "#FFFFFF" },
  { name: "Violet", fg: "#7C3AED", bg: "#FFFFFF" },
  { name: "Ocean", fg: "#0EA5E9", bg: "#F0F9FF" },
  { name: "Forest", fg: "#059669", bg: "#ECFDF5" },
  { name: "Sunset", fg: "#EA580C", bg: "#FFF7ED" },
  { name: "Rose", fg: "#E11D48", bg: "#FFF1F2" },
];

export const QRGenerator = () => {
  const ref = useRef<HTMLDivElement>(null);
  const qrInstance = useRef<QRCodeStyling | null>(null);

  const [qrType, setQrType] = useState<QRType>("url");
  const [url, setUrl] = useState("https://lovable.dev");
  const [text, setText] = useState("Hello from QR Forge ✨");
  const [email, setEmail] = useState({ to: "", subject: "", body: "" });
  const [phone, setPhone] = useState("");
  const [sms, setSms] = useState({ number: "", message: "" });
  const [wifi, setWifi] = useState({
    ssid: "",
    password: "",
    encryption: "WPA" as "WPA" | "WEP" | "nopass",
    hidden: false,
  });

  const [logo, setLogo] = useState<string>("");
  const [size, setSize] = useState(320);
  const [fgColor, setFgColor] = useState("#0F172A");
  const [bgColor, setBgColor] = useState("#FFFFFF");
  const [useGradient, setUseGradient] = useState(false);
  const [gradientColor, setGradientColor] = useState("#7C3AED");
  const [dotStyle, setDotStyle] = useState<DotType>("rounded");
  const [cornerSquareStyle, setCornerSquareStyle] =
    useState<CornerSquareType>("extra-rounded");
  const [cornerDotStyle, setCornerDotStyle] = useState<CornerDotType>("dot");
  const [logoSize, setLogoSize] = useState(0.4);
  const [exportFormat, setExportFormat] =
    useState<"png" | "jpeg" | "webp" | "svg">("png");

  const data = useMemo(() => {
    switch (qrType) {
      case "url":
        return url || " ";
      case "text":
        return text || " ";
      case "email": {
        const params = new URLSearchParams();
        if (email.subject) params.set("subject", email.subject);
        if (email.body) params.set("body", email.body);
        const qs = params.toString();
        return `mailto:${email.to}${qs ? `?${qs}` : ""}`;
      }
      case "phone":
        return `tel:${phone}`;
      case "sms":
        return `SMSTO:${sms.number}:${sms.message}`;
      case "wifi":
        return `WIFI:T:${wifi.encryption};S:${wifi.ssid};P:${wifi.password};${
          wifi.hidden ? "H:true;" : ""
        };`;
      default:
        return " ";
    }
  }, [qrType, url, text, email, phone, sms, wifi]);

  const options: Options = useMemo(
    () => ({
      width: size,
      height: size,
      type: "svg",
      data,
      margin: 12,
      qrOptions: { errorCorrectionLevel: "H" },
      image: logo || undefined,
      imageOptions: {
        crossOrigin: "anonymous",
        margin: 6,
        imageSize: logoSize,
        hideBackgroundDots: true,
      },
      dotsOptions: useGradient
        ? {
            type: dotStyle,
            gradient: {
              type: "linear",
              rotation: Math.PI / 4,
              colorStops: [
                { offset: 0, color: fgColor },
                { offset: 1, color: gradientColor },
              ],
            },
          }
        : { type: dotStyle, color: fgColor },
      backgroundOptions: { color: bgColor },
      cornersSquareOptions: {
        type: cornerSquareStyle,
        color: useGradient ? gradientColor : fgColor,
      },
      cornersDotOptions: {
        type: cornerDotStyle,
        color: useGradient ? gradientColor : fgColor,
      },
    }),
    [
      size,
      data,
      logo,
      logoSize,
      useGradient,
      dotStyle,
      fgColor,
      gradientColor,
      bgColor,
      cornerSquareStyle,
      cornerDotStyle,
    ]
  );

  useEffect(() => {
    if (!qrInstance.current) {
      qrInstance.current = new QRCodeStyling(options);
      if (ref.current) {
        ref.current.innerHTML = "";
        qrInstance.current.append(ref.current);
      }
    } else {
      qrInstance.current.update(options);
    }
  }, [options]);

  const handleLogoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Logo too large. Please use a file under 2MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setLogo(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleDownload = async () => {
    if (!qrInstance.current) return;
    try {
      await qrInstance.current.download({
        name: `qr-code-${Date.now()}`,
        extension: exportFormat,
      });
      toast.success("QR code downloaded!");
    } catch {
      toast.error("Download failed. Please try again.");
    }
  };

  const applyPreset = (p: (typeof presets)[number]) => {
    setFgColor(p.fg);
    setBgColor(p.bg);
    setUseGradient(false);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
      {/* Left — Inputs */}
      <Card className="p-6 md:p-8 shadow-soft border-border/60 animate-fade-in">
        <Tabs value={qrType} onValueChange={(v) => setQrType(v as QRType)}>
          <TabsList className="grid grid-cols-3 md:grid-cols-6 w-full h-auto bg-secondary/60 p-1 gap-1">
            <TabsTrigger value="url" className="gap-1.5 py-2">
              <LinkIcon className="w-3.5 h-3.5" /> URL
            </TabsTrigger>
            <TabsTrigger value="text" className="gap-1.5 py-2">
              <Type className="w-3.5 h-3.5" /> Text
            </TabsTrigger>
            <TabsTrigger value="email" className="gap-1.5 py-2">
              <Mail className="w-3.5 h-3.5" /> Email
            </TabsTrigger>
            <TabsTrigger value="phone" className="gap-1.5 py-2">
              <Phone className="w-3.5 h-3.5" /> Phone
            </TabsTrigger>
            <TabsTrigger value="sms" className="gap-1.5 py-2">
              <MessageSquare className="w-3.5 h-3.5" /> SMS
            </TabsTrigger>
            <TabsTrigger value="wifi" className="gap-1.5 py-2">
              <Wifi className="w-3.5 h-3.5" /> WiFi
            </TabsTrigger>
          </TabsList>

          <div className="mt-6 space-y-5">
            <TabsContent value="url" className="m-0 space-y-2">
              <Label>Website URL</Label>
              <Input
                type="url"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value.slice(0, 2000))}
                className="h-12 font-mono text-sm"
              />
            </TabsContent>

            <TabsContent value="text" className="m-0 space-y-2">
              <Label>Plain text</Label>
              <Input
                value={text}
                onChange={(e) => setText(e.target.value.slice(0, 1000))}
                className="h-12"
                placeholder="Anything you want to encode"
              />
            </TabsContent>

            <TabsContent value="email" className="m-0 space-y-3">
              <div className="space-y-2">
                <Label>Recipient email</Label>
                <Input
                  type="email"
                  placeholder="hello@example.com"
                  value={email.to}
                  onChange={(e) =>
                    setEmail({ ...email, to: e.target.value.slice(0, 255) })
                  }
                  className="h-12"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Subject</Label>
                  <Input
                    value={email.subject}
                    onChange={(e) =>
                      setEmail({ ...email, subject: e.target.value.slice(0, 200) })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Message</Label>
                  <Input
                    value={email.body}
                    onChange={(e) =>
                      setEmail({ ...email, body: e.target.value.slice(0, 500) })
                    }
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="phone" className="m-0 space-y-2">
              <Label>Phone number</Label>
              <Input
                type="tel"
                placeholder="+1 555 123 4567"
                value={phone}
                onChange={(e) => setPhone(e.target.value.slice(0, 30))}
                className="h-12"
              />
            </TabsContent>

            <TabsContent value="sms" className="m-0 space-y-3">
              <div className="space-y-2">
                <Label>Phone number</Label>
                <Input
                  type="tel"
                  value={sms.number}
                  onChange={(e) =>
                    setSms({ ...sms, number: e.target.value.slice(0, 30) })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Pre-filled message</Label>
                <Input
                  value={sms.message}
                  onChange={(e) =>
                    setSms({ ...sms, message: e.target.value.slice(0, 300) })
                  }
                />
              </div>
            </TabsContent>

            <TabsContent value="wifi" className="m-0 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Network name (SSID)</Label>
                  <Input
                    value={wifi.ssid}
                    onChange={(e) =>
                      setWifi({ ...wifi, ssid: e.target.value.slice(0, 64) })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Password</Label>
                  <Input
                    type="text"
                    value={wifi.password}
                    onChange={(e) =>
                      setWifi({ ...wifi, password: e.target.value.slice(0, 64) })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Encryption</Label>
                <Select
                  value={wifi.encryption}
                  onValueChange={(v) =>
                    setWifi({ ...wifi, encryption: v as typeof wifi.encryption })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="WPA">WPA / WPA2</SelectItem>
                    <SelectItem value="WEP">WEP</SelectItem>
                    <SelectItem value="nopass">No password</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>
          </div>
        </Tabs>

        {/* Logo upload */}
        <div className="mt-8 pt-6 border-t border-border/60">
          <div className="flex items-center gap-2 mb-3">
            <ImageIcon className="w-4 h-4 text-primary" />
            <h3 className="font-display font-semibold">Brand logo</h3>
          </div>
          <div className="flex items-center gap-3">
            <label className="flex-1 cursor-pointer">
              <div className="border-2 border-dashed border-border hover:border-primary/60 hover:bg-primary/5 transition-all rounded-xl p-4 text-center">
                <p className="text-sm text-muted-foreground">
                  {logo ? "Replace logo" : "Click to upload PNG, JPG or SVG (max 2MB)"}
                </p>
              </div>
              <input
                type="file"
                accept="image/png,image/jpeg,image/svg+xml,image/webp"
                onChange={handleLogoUpload}
                className="hidden"
              />
            </label>
            {logo && (
              <Button
                variant="outline"
                size="icon"
                onClick={() => setLogo("")}
                className="h-14 w-14 shrink-0"
                aria-label="Remove logo"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
          {logo && (
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Logo size</span>
                <span className="font-mono">{Math.round(logoSize * 100)}%</span>
              </div>
              <Slider
                value={[logoSize * 100]}
                min={10}
                max={50}
                step={1}
                onValueChange={(v) => setLogoSize(v[0] / 100)}
              />
            </div>
          )}
        </div>

        {/* Style controls */}
        <div className="mt-8 pt-6 border-t border-border/60 space-y-6">
          <div className="flex items-center gap-2">
            <Shapes className="w-4 h-4 text-primary" />
            <h3 className="font-display font-semibold">Shape & style</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-xs">Dot style</Label>
              <Select value={dotStyle} onValueChange={(v) => setDotStyle(v as DotType)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {dotStyles.map((s) => (
                    <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Corner frame</Label>
              <Select
                value={cornerSquareStyle}
                onValueChange={(v) => setCornerSquareStyle(v as CornerSquareType)}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {cornerSquareStyles.map((s) => (
                    <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Corner dot</Label>
              <Select
                value={cornerDotStyle}
                onValueChange={(v) => setCornerDotStyle(v as CornerDotType)}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {cornerDotStyles.map((s) => (
                    <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <Palette className="w-4 h-4 text-primary" />
            <h3 className="font-display font-semibold">Colors</h3>
          </div>

          <div className="flex flex-wrap gap-2">
            {presets.map((p) => (
              <button
                key={p.name}
                onClick={() => applyPreset(p)}
                className="group flex items-center gap-2 px-3 py-1.5 rounded-full border border-border hover:border-primary/60 hover:bg-primary/5 transition-all text-xs font-medium"
              >
                <span
                  className="w-3 h-3 rounded-full border border-black/10"
                  style={{ background: p.fg }}
                />
                {p.name}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <ColorField label="Foreground" value={fgColor} onChange={setFgColor} />
            <ColorField label="Background" value={bgColor} onChange={setBgColor} />
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/60">
            <div>
              <p className="text-sm font-medium">Gradient dots</p>
              <p className="text-xs text-muted-foreground">Blend two colors</p>
            </div>
            <button
              onClick={() => setUseGradient(!useGradient)}
              className={`relative w-11 h-6 rounded-full transition-colors ${
                useGradient ? "bg-primary" : "bg-muted-foreground/30"
              }`}
              aria-pressed={useGradient}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-background shadow-sm transition-transform ${
                  useGradient ? "translate-x-5" : ""
                }`}
              />
            </button>
          </div>

          {useGradient && (
            <ColorField
              label="Gradient end color"
              value={gradientColor}
              onChange={setGradientColor}
            />
          )}

          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Size</span>
              <span className="font-mono">{size}px</span>
            </div>
            <Slider
              value={[size]}
              min={200}
              max={800}
              step={20}
              onValueChange={(v) => setSize(v[0])}
            />
          </div>
        </div>
      </Card>

      {/* Right — Preview */}
      <div className="lg:sticky lg:top-6 self-start space-y-4 animate-fade-in">
        <Card className="p-6 shadow-elegant border-border/60 bg-gradient-to-br from-card to-secondary/40">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <h3 className="font-display font-semibold">Live preview</h3>
            </div>
          </div>

          <div className="flex items-center justify-center rounded-2xl bg-background p-6 min-h-[360px] shadow-soft">
            <div ref={ref} className="animate-fade-in" />
          </div>

          <div className="mt-5 grid grid-cols-[1fr_auto] gap-2">
            <Select
              value={exportFormat}
              onValueChange={(v) => setExportFormat(v as typeof exportFormat)}
            >
              <SelectTrigger className="h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="png">PNG (recommended)</SelectItem>
                <SelectItem value="svg">SVG (vector)</SelectItem>
                <SelectItem value="jpeg">JPEG</SelectItem>
                <SelectItem value="webp">WebP</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={handleDownload}
              size="lg"
              className="h-12 bg-gradient-primary hover:opacity-90 text-primary-foreground shadow-elegant gap-2"
            >
              <Download className="w-4 h-4" /> Download
            </Button>
          </div>

          <p className="mt-4 text-xs text-muted-foreground text-center">
            Tip: Always test your QR code by scanning before sharing.
          </p>
        </Card>
      </div>
    </div>
  );
};

const ColorField = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) => (
  <div className="space-y-2">
    <Label className="text-xs">{label}</Label>
    <div className="flex items-center gap-2 rounded-xl border border-input bg-background pr-3 focus-within:ring-2 focus-within:ring-ring">
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 w-12 rounded-l-xl cursor-pointer border-0 bg-transparent"
        aria-label={`${label} color picker`}
      />
      <input
        type="text"
        value={value.toUpperCase()}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 bg-transparent font-mono text-sm outline-none"
        maxLength={9}
      />
    </div>
  </div>
);
