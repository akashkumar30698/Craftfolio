"use client"

import { useState } from 'react'
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useFormContext } from '../context/formContext'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"

const predefinedSkills = [
    { id: "html", label: "HTML" },
    { id: "css", label: "CSS" },
    { id: "javascript", label: "JAVASCRIPT" },
    { id: "react", label: "REACT" },
    { id: "nextjs", label: "NEXTJS" },
    { id: "c", label: "C" },
    { id: "c++", label: "C++" },
    { id: "java", label: "JAVA" },
    { id: "typescript", label: "TYPESCRIPT" },
    { id: "ruby", label: "RUBY" },
    { id: "golang", label: "GOLANG" },
    { id: "php", label: "PHP" },
    { id: "python", label: "PYTHON" },
    { id: "scala", label: "SCALA" },
    { id: "swift", label: "SWIFT" },
    { id: "c#", label: "C#" },
    { id: "rust", label: "RUST" },
    { id: "redux", label: "REDUX" },
    { id: "angular", label: "ANGULAR.JS" },
    { id: "svelte", label: "SVELTE" },
    { id: "vue", label: "VUE.JS" },
    { id: "tailwind", label: "TAILWIND CSS" },
    { id: "bootstrap", label: "BOOTSTRAP" },
    { id: "node", label: "NODE.JS" },
    { id: "express", label: "EXPRESS.JS" },
    { id: "kafka", label: "APACHE KAFKA" },
    { id: "nginx", label: "NGINX" },
    { id: "springboot", label: "SPRINGBOOT" },
    { id: "nest", label: "NEST" },
    { id: "flutter", label: "FLUTTER" },
    { id: "reactNative", label: "REACT NATIVE" },
    { id: "kotlin", label: "KOTLIN" },
    { id: "mongodb", label: "MONGODB" },
    { id: "redis", label: "REDIS" },
    { id: "mysql", label: "MY SQL" },
    { id: "postgresql", label: "POSTGRESQL" },
    { id: "cassandradb", label: "CASSANDRA DB" },
    { id: "aws", label: "AWS" },
    { id: "docker", label: "DOCKER" },
    { id: "kubernetes", label: "KUBERNETES" },
    { id: "jenkins", label: "JENKINS" },
    { id: "microsoftazure", label: "MICROSOFT AZURE" },
    { id: "firebase", label: "FIREBASE" },
    { id: "supabase", label: "SUPABASE" },
    { id: "django", label: "DJANGO" },
    { id: "flask", label: "FLASK" },
    { id: "electron", label: "ELECTRON.JS" }
]

export default function SkillsForm() {
    const [selectedSkills, setSelectedSkills] = useState<string[]>([])
    const { updateFormData } = useFormContext()

    const handleSkillChange = (skill: string, checked: boolean) => {
        setSelectedSkills((prev) =>
          checked ? [...prev, skill] : prev.filter((s) => s !== skill)
        );
        updateFormData("skills", checked ? [...selectedSkills, skill] : selectedSkills.filter((s) => s !== skill));
      };

      


    return (
        <Card className="w-[350px]">
            <CardHeader>
                <CardTitle>Create project</CardTitle>
                <CardDescription>Deploy your new project in one-click.</CardDescription>
            </CardHeader>
            <CardContent>
                    <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col space-y-1.5">
                            {predefinedSkills.map((skill) => (
                                <div key={skill.id} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={skill.id.toUpperCase()}
                                        checked={selectedSkills.includes(skill.id.toUpperCase())}
                                        onCheckedChange={(checked) => handleSkillChange(skill.id.toUpperCase(),checked as boolean)}
                                    />
                                    <Label htmlFor={skill.id}>{skill.label}</Label>
                                </div>
                            ))}
                        </div>

                    </div>
            </CardContent>
            <CardFooter className="flex justify-between">

            </CardFooter>
        </Card>
    )
}





