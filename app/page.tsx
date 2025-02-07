"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardHeader,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { BorderBeam } from "@/components/ui/border-beam";
import { DotPattern } from "@/components/ui/dot-pattern";
import { Dock, DockIcon } from "@/components/ui/dock";
import { Icons } from "@/components/ui/icons";
import GradualSpacing from "@/components/ui/gradual-spacing";

const API_URL = "https://openrouter.ai/api/v1/chat/completions";
const API_TOKEN = process.env.NEXT_PUBLIC_OPENROUTER_API;

const generateResponse = async (prompt: string): Promise<string> => {
  const formattedPrompt = `Generate a professional LinkedIn headline in 6-7 words based on the following input: "${prompt}" and just only give the headline no other extra stuffs, if more options of headline are there give them one by one`;

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-2.0-pro-exp-02-05:free",
      messages: [{ role: "user", content: formattedPrompt }],
    }),
  });

  if (!response.ok) {
    const errorDetails = await response.text();
    throw new Error(
      `Failed to fetch response. Status: ${response.status}. Details: ${errorDetails}`
    );
  }

  const result = await response.json();
  return (
    result.choices?.[0]?.message?.content?.trim() ||
    "No response generated. Please try again."
  );
};

export default function OpenRouterChat() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("Please enter a prompt");
      return;
    }

    setError("");
    setIsLoading(true);
    try {
      const generatedResponse = await generateResponse(prompt);
      setResponse(generatedResponse);
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-center">
      <DotPattern
        className={cn(
          "[mask-image:radial-gradient(900px_circle_at_center,black,transparent)]"
        )}
      />

      <Card className="w-full max-w-2xl mx-auto relative">
        <BorderBeam size={500} duration={12} delay={12} />
        <CardHeader>
          <GradualSpacing
            className="font-display text-center text-4xl font-bold -tracking-widest text-black dark:text-white md:text-7xl md:leading-[5rem]"
            text="LinkDescrip-AI"
          />
          <CardDescription className="font-display text-center text-lg text-gray-500 dark:text-gray-400">
            Enter your bio to get a catchy Linkedin headline
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Enter your prompt here..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={5}
            className="resize-none"
          />
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {response && (
            <Alert>
              <AlertTitle>Generated Response</AlertTitle>
              <AlertDescription>{response}</AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleGenerate}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              "Generate Response"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
