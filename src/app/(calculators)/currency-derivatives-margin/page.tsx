import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ComingSoonPage() {
  return (
    <div className="flex items-center justify-center h-full">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">This calculator is under construction. Please check back later!</p>
        </CardContent>
      </Card>
    </div>
  );
}
