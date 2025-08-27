"use client";

import { CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { CustomTextarea } from "@/components/ui/custom-textarea";
import JobReview from "@/components/job-review";
import useUpdateJob from "@/hooks/use-update-job";
import { ChangeEvent, useEffect, useState } from "react";
import { ReviewJobRecord } from "@/hooks/use-jobs";

interface ReviewJobCardProps {
  job: ReviewJobRecord;
}

const ReviewJobCard = ({ job }: ReviewJobCardProps) => {
  const output = job.output ?? {};
  const [data, setData] = useState(output);

  const { mutate: updateJobRecord } = useUpdateJob(job.id);

  useEffect(() => {
    if (job.output) {
      setData(job.output);
    }
  }, [job.output]);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    updateJobRecord({ output: data });
  };

  return (
    <div className='p-1'>
      <div className="flex flex-col gap-4 px-4">
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className="flex flex-col gap-2">
            <Label htmlFor={`output-${key}`} className="mt-2">
              {key}
            </Label>
            <CustomTextarea
              id={`output-${key}`}
              name={key}
              className="resize-none overflow-auto"
              value={typeof value === "string" ? value : JSON.stringify(value)}
              onChange={handleChange}
              onBlur={handleSave}
            />
          </div>
        ))}
      </div>
      <CardFooter className="flex flex-col items-end gap-4 px-6 pb-4 mt-4">
        <JobReview job={job} />
      </CardFooter>
    </div>
  );
};

export default ReviewJobCard;
