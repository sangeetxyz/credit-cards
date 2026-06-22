import { isGateUnlocked } from "@/lib/gate-session";
import { GateScreen } from "./gate-screen";

type GateGuardProps = {
  children: React.ReactNode;
};

export async function GateGuard({ children }: GateGuardProps) {
  if (await isGateUnlocked()) {
    return children;
  }

  return <GateScreen />;
}
