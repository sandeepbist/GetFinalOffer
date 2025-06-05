"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export const VerifyCallout: React.FC = () => {
  const [subject, setSubject] = useState("");
  const [notes, setNotes] = useState("");
  const [links, setLinks] = useState("");
  const [files, setFiles] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = () => {
    if (!subject || files.length === 0) return;
    // TODO: send to backend
    console.log("Submitting:", { subject, notes, links, files });
  };

  return (
    <Card className="rounded-xl shadow-lg bg-blue-50">
      <CardContent className="flex flex-col md:flex-row items-center justify-between gap-4 p-6">
        <div className="flex items-start gap-3">
          <MailCheck className="h-6 w-6 text-blue-600" />
          <div>
            <h4 className="text-sm font-medium text-gray-800">
              Verify Your Interview Progress
            </h4>
            <p className="mt-1 text-xs text-gray-600">
              Get your interview progress verified to gain credibility with
              recruiters
            </p>
          </div>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 text-white hover:bg-blue-700">
              Request Verification
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Submit Verification Request</DialogTitle>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Amazon SDE Interview"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Describe what you are submitting, context, or additional comments..."
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="links">Links</Label>
                <Input
                  id="links"
                  value={links}
                  onChange={(e) => setLinks(e.target.value)}
                  placeholder="Paste links to email screenshots, LinkedIn posts, etc."
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="file">Upload Document(s)</Label>
                <Input
                  id="file"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  multiple
                  onChange={handleFileChange}
                  required
                />
              </div>
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button
                onClick={handleSubmit}
                disabled={!subject || files.length === 0}
              >
                Submit Request
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};
