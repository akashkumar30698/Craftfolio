"use client"

import React from "react";
import { Timeline } from "@/components/ui/timeline";
import { CardSection } from "./cardComp";
import AboutMeSection from "./aboutMe";
import SkillsForm from "./skills";
import MultiProjectForm from "./projects";
import SocialMediaLinksForm from "./socials";
import { FormWrapper } from "../hooks/formWrapper";
import { FormProvider } from "../context/formContext";
import { useFormSubmit } from "../hooks/useFormSubmit";

export default function TimelineSection() {

  const { isSubmitting } = useFormSubmit()

  const data = [
    {
      title: "2024",
      content: (
        <div>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
            Built and launched Aceternity UI and Aceternity UI Pro from scratch
          </p>
          <CardSection />
          <div className="grid grid-cols-2 gap-4">
          </div>
        </div>
      ),
    },
    {
      title: "Early 2023",
      content: (
        <div>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
            I usually run out of copy, but when I see content this big, I try to
            integrate lorem ipsum.
          </p>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
            Lorem ipsum is for people who are too lazy to write copy. But we are
            not. Here are some more example of beautiful designs I built.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <AboutMeSection />
          </div>
        </div>
      ),
    },
    {
      title: "Changelog",
      content: (
        <div>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-4">
            Deployed 5 new components on Aceternity today
          </p>
          <div className="mb-8">
          </div>
          <div className="grid grid-cols-2 gap-4">
            <SkillsForm />
          </div>
        </div>
      ),
    },
    {
      title: "lol",
      content: (
        <div>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-4">
            Deployed 5 new components on Aceternity today
          </p>
          <div className="mb-8">
          </div>
          <div className="grid grid-cols-2 gap-4">
            <MultiProjectForm />
          </div>
        </div>
      )
    },
    {
      title: "Socials",
      content: (
        <div>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-4">
            Deployed 5 new components on Aceternity today
          </p>
          <div className="mb-8">
          </div>
          <div className="grid grid-cols-2 gap-4">
            <SocialMediaLinksForm isSubmitting={isSubmitting}  />
          </div>
        </div>
      )
    }
  ];
  return (
    <div className="w-full">
 
        <FormProvider>
          <FormWrapper>
            <Timeline data={data} />
          </FormWrapper>
        </FormProvider>

    </div>
  );
}
