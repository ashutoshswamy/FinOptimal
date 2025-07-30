import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Construction } from "lucide-react";

export function UnderConstruction({ title = "Coming Soon", message }: { title?: string, message: string }) {
  return (
    <div className="flex items-center justify-center h-full py-16">
      <Card className="w-full max-w-lg text-center">
        <CardHeader>
           <div className="mx-auto bg-primary/10 p-4 rounded-full">
              <Construction className="w-12 h-12 text-primary" />
           </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <CardTitle className="text-2xl font-bold">{title}</CardTitle>
          <CardDescription className="text-muted-foreground">
            This calculator is under construction. We are working hard to bring it to you.
            {' '}
            {message}
            {' '}
            Please check back later!
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  );
}
