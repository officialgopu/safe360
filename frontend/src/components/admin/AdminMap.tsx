import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet";
import { useEffect, useState } from "react";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import { Card, CardContent } from "@/components/ui/card";
import { LatLngTuple, Map as LeafletMap } from "leaflet";

// Fix for typescript issues with react-leaflet
declare module 'react-leaflet' {
  interface MapContainerProps {
    center: LatLngTuple;
    zoom: number;
    scrollWheelZoom?: boolean;
    className?: string;
    style?: React.CSSProperties;
  }

  interface TileLayerProps {
    url: string;
    attribution?: string;
  }

  interface CircleMarkerProps {
    center: LatLngTuple;
    pathOptions?: {
      color: string;
      fillColor: string;
      fillOpacity: number;
      weight: number;
      dashArray?: string;
      dashOffset?: string;
      opacity?: number;
    };
    radius?: number;
    eventHandlers?: {
      add?: (e: any) => void;
      remove?: (e: any) => void;
    };
  }
}

interface HeatPoint {
  lat: number;
  lon: number;
  risk: number;
  area_name?: string;
  alert_count?: number;
}

export default function AdminMap() {
  const [points, setPoints] = useState<HeatPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Sample data for testing
    const sampleData: HeatPoint[] = [
      { lat: 28.6139, lon: 77.2090, risk: 0.8, area_name: "Delhi", alert_count: 15 },
      { lat: 19.0760, lon: 72.8777, risk: 0.7, area_name: "Mumbai", alert_count: 12 },
      { lat: 12.9716, lon: 77.5946, risk: 0.6, area_name: "Bangalore", alert_count: 8 },
      { lat: 22.5726, lon: 88.3639, risk: 0.5, area_name: "Kolkata", alert_count: 6 },
      { lat: 17.3850, lon: 78.4867, risk: 0.4, area_name: "Hyderabad", alert_count: 5 },
      { lat: 13.0827, lon: 80.2707, risk: 0.3, area_name: "Chennai", alert_count: 4 },
      { lat: 26.9124, lon: 75.7873, risk: 0.6, area_name: "Jaipur", alert_count: 7 },
      { lat: 23.0225, lon: 72.5714, risk: 0.5, area_name: "Ahmedabad", alert_count: 5 }
    ];
    setPoints(sampleData);
    setLoading(false);

    // Uncomment this when backend is ready
    /*const fetchData = async () => {
      try {
        const res = await axios.get("/api/admin/map/heatmap");
        setPoints(res.data.heatmap || []);
      } catch (err) {
        console.error("Map data error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();*/
  }, []);

  const getColor = (risk: number) => {
    if (risk > 0.7) return "#ef4444";  // High risk - Red
    if (risk > 0.5) return "#f97316";  // Medium risk - Orange
    if (risk > 0.3) return "#eab308";  // Low-medium risk - Yellow
    return "#22c55e";                   // Low risk - Green
  };

  const getRiskLabel = (risk: number) => {
    if (risk > 0.7) return "High";
    if (risk > 0.5) return "Medium";
    if (risk > 0.3) return "Low-Medium";
    return "Low";
  };

  // Calculate circle size based on alert count
  const getRadius = (count: number = 1) => {
    return Math.max(15, Math.min(30, 10 + count * 1.5));
  };

  if (loading) {
    return (
      <Card className="w-full h-[600px] shadow-lg">
        <CardContent className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
        </CardContent>
      </Card>
    );
  }

  const defaultCenter: LatLngTuple = [20.5937, 78.9629];
  
  return (
    <Card className="w-full h-[600px] shadow-lg">
      <CardContent className="p-0">
        <div className="h-[600px] rounded-lg overflow-hidden">
          <MapContainer
            center={defaultCenter}
            zoom={5}
            scrollWheelZoom={true}
            className="h-full w-full"
            style={{ background: "#f8fafc" }}
          >
            <TileLayer 
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='Map data &copy; OpenStreetMap contributors'
            />
            {points.map((p, i) => {
              const position: LatLngTuple = [p.lat, p.lon];
              const isHighRisk = p.risk > 0.7;
              return (
                <CircleMarker
                  key={i}
                  center={position}
                  pathOptions={{
                    color: getColor(p.risk),
                    fillColor: getColor(p.risk),
                    fillOpacity: 0.6,
                    weight: isHighRisk ? 3 : 2,
                    dashArray: isHighRisk ? "5,5" : "",
                    dashOffset: isHighRisk ? "0" : "",
                    opacity: isHighRisk ? 0.8 : 1
                  }}
                  radius={getRadius(p.alert_count)}
                  eventHandlers={
                    isHighRisk ? {
                      add: (e) => {
                        const marker = e.target;
                        const animate = () => {
                          marker.setStyle({ weight: 3, opacity: 0.8 });
                          setTimeout(() => {
                            marker.setStyle({ weight: 4, opacity: 0.4 });
                          }, 500);
                        };
                        animate();
                        setInterval(animate, 1000);
                      }
                    } : undefined
                  }
                >
                  <Tooltip>
                    <div className="p-2">
                      <div className="font-semibold text-base">
                        {p.area_name || "Unknown Area"}
                      </div>
                      <div className="text-sm mt-1">
                        Risk Level: <span className="font-medium" style={{ color: getColor(p.risk) }}>
                          {getRiskLabel(p.risk)}
                        </span>
                      </div>
                      <div className="text-sm">
                        Risk Score: {(p.risk * 100).toFixed(1)}%
                      </div>
                      {p.alert_count && (
                        <div className="text-sm mt-1 text-gray-600">
                          Active Alerts: {p.alert_count}
                        </div>
                      )}
                    </div>
                  </Tooltip>
                </CircleMarker>
              );
            })}
          </MapContainer>
        </div>
      </CardContent>
    </Card>
  );
}
