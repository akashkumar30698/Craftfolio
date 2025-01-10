"use client";

import React, { useEffect, useRef, MutableRefObject } from "react";
import { useSearchParams } from "next/navigation";
import { useFormContext } from "../context/formContext";

// Create a custom hook to manage the shared ref
export function useSharedIframeRef(): MutableRefObject<HTMLIFrameElement | null> {
  const ref = useRef<HTMLIFrameElement | null>(null);
  return ref;
}

let getIframeRef

export function useIframeRef() {
  return getIframeRef
}


const skillsData = [
  { id: "HTML", url: "https://www.vinodjangid.site/src/png/htmllogo.png" },
  { id: "CSS", url: "https://www.vinodjangid.site/src/png/csslogo.png" },
  { id: "JAVASCRIPT", url: "https://www.vinodjangid.site/src/png/jslogo.png" },
  { id: "BOOTSTRAP", url: "https://www.vinodjangid.site/src/png/bootstraplogo.png" },
  { id: "REACT", url: "https://www.vinodjangid.site/src/png/reactlogo.png" },
  { id: "REDUX", url: "https://res.cloudinary.com/djpbqetkj/image/upload/v1734949592/pngwing.com_8_pjdceh.png" },
  { id: "NODE.JS", url: "https://www.vinodjangid.site/src/png/node.png" },
  { id: "EXPRESS.JS", url: "https://res.cloudinary.com/djpbqetkj/image/upload/v1735025689/pngwing.com_13_cs7fpc.png" },
  { id: "MONGODB", url: "https://res.cloudinary.com/djpbqetkj/image/upload/v1735026669/pngwing.com_20_bnl7im.png" },
  { id: "ANGULAR.JS", url: "https://res.cloudinary.com/djpbqetkj/image/upload/v1735025290/pngwing.com_9_vbuqkm.png" },
  { id: "VUE.JS", url: "https://res.cloudinary.com/djpbqetkj/image/upload/v1735025468/pngwing.com_11_jueczq.png" },
  { id: "SVELTE", url: "https://res.cloudinary.com/djpbqetkj/image/upload/v1735025399/pngwing.com_10_ovebvf.png" },
  { id: "TAILWIND CSS", url: "https://res.cloudinary.com/djpbqetkj/image/upload/v1735025540/pngwing.com_12_gpuctf.png" },
  { id: "DJANGO", url: "https://res.cloudinary.com/djpbqetkj/image/upload/v1735028125/pngwing.com_31_wxid9z.png" },
  { id: "FLASK", url: "https://res.cloudinary.com/djpbqetkj/image/upload/v1735028180/pngwing.com_32_sipox8.png" },
  { id: "ELECTRON.JS", url: "https://res.cloudinary.com/djpbqetkj/image/upload/v1735028339/pngwing.com_33_fpbivc.png" },
  { id: "JAVA", url: "https://res.cloudinary.com/djpbqetkj/image/upload/v1734947821/pnghut_java-runtime-environment-system-development-kit-plum_zoiii4.png" },
  { id: "RUBY", url: "https://res.cloudinary.com/djpbqetkj/image/upload/v1734948464/pngwing.com_hse11o.png" },
  { id: "GOLANG", url: "https://res.cloudinary.com/djpbqetkj/image/upload/v1734948727/pngwing.com_1_aghtai.png" },
  { id: "PHP", url: "https://res.cloudinary.com/djpbqetkj/image/upload/v1734948955/pngwing.com_2_ogtzyg.png" },
  { id: "PYTHON", url: "https://res.cloudinary.com/djpbqetkj/image/upload/v1734949100/pngwing.com_3_u3ddtx.png" },
  { id: "SCALA", url: "https://res.cloudinary.com/djpbqetkj/image/upload/v1734949239/pngwing.com_4_ojmqag.png" },
  { id: "SWIFT", url: "https://res.cloudinary.com/djpbqetkj/image/upload/v1734949333/pngwing.com_5_xkz9s4.png" },
  { id: "C#", url: "https://res.cloudinary.com/djpbqetkj/image/upload/v1734949390/pngwing.com_6_bph3dv.png" },
  { id: "RUST", url: "https://res.cloudinary.com/djpbqetkj/image/upload/v1734949519/pngwing.com_7_aquhg4.png" },
  { id: "KOTLIN", url: "https://res.cloudinary.com/djpbqetkj/image/upload/v1735026577/pngwing.com_19_ev5ukr.png" },
  { id: "FLUTTER", url: "https://res.cloudinary.com/djpbqetkj/image/upload/v1735026404/pngwing.com_17_m0jjhq.png" },
  { id: "REACT NATIVE", url: "https://res.cloudinary.com/djpbqetkj/image/upload/v1735026481/pngwing.com_18_dgddcw.png" },
  { id: "NEST", url: "https://res.cloudinary.com/djpbqetkj/image/upload/v1735026322/nest-js_k2z5hs.png" },
  { id: "SPRINGBOOT", url: "https://res.cloudinary.com/djpbqetkj/image/upload/v1735025969/pngwing.com_16_hyhuuf.png" },
  { id: "APACHE KAFKA", url: "https://res.cloudinary.com/djpbqetkj/image/upload/v1735025774/pngwing.com_14_tiexpf.png" },
  { id: "NGINX", url: "https://res.cloudinary.com/djpbqetkj/image/upload/v1735025853/pngwing.com_15_aucbrk.png" },
  { id: "FIREBASE", url: "https://res.cloudinary.com/djpbqetkj/image/upload/v1735027885/pngwing.com_30_bytsz4.png" },
  { id: "AWS", url: "https://res.cloudinary.com/djpbqetkj/image/upload/v1735027479/pngwing.com_25_xdyoz5.png" },
  { id: "DOCKER", url: "https://res.cloudinary.com/djpbqetkj/image/upload/v1735027552/pngwing.com_26_kfvino.png" },
  { id: "KUBERNETES", url: "https://res.cloudinary.com/djpbqetkj/image/upload/v1735027643/pngwing.com_27_rux2sr.png" },
  { id: "JENKINS", url: "https://res.cloudinary.com/djpbqetkj/image/upload/v1735027704/pngwing.com_28_gto9vt.png" },
  { id: "MICROSOFT AZURE", url: "https://res.cloudinary.com/djpbqetkj/image/upload/v1735027786/pngwing.com_29_alcdyz.png" },
  { id: "SUPABASE", url: "https://res.cloudinary.com/djpbqetkj/image/upload/v1735028056/Supabase_Icon_zlma4x.png" },
  { id: "REDIS", url: "https://res.cloudinary.com/djpbqetkj/image/upload/v1735027117/pngwing.com_21_bd3los.png" },
  { id: "MY SQL", url: "https://res.cloudinary.com/djpbqetkj/image/upload/v1735027209/pngwing.com_22_oox22y.png" },
  { id: "POSTGRESQL", url: "https://res.cloudinary.com/djpbqetkj/image/upload/v1735027299/pngwing.com_23_clvtc7.png" },
  { id: "CASSANDRA DB", url: "https://res.cloudinary.com/djpbqetkj/image/upload/v1735027381/pngwing.com_24_botbgy.png" },
  { id:"NEXT.JS" ,url: "https://res.cloudinary.com/djpbqetkj/image/upload/v1736413319/pngwing.com_34_bafoye.png" },
  { id: "TYPESCRIPT", url: "https://res.cloudinary.com/djpbqetkj/image/upload/v1734948045/pnghut_angularjs-typescript-javascript-vue-js-library-brand_ifepkv.png"},
  { id: "C", url: "https://res.cloudinary.com/djpbqetkj/image/upload/v1736413372/pngwing.com_35_hftpib.png"},
  { id: "C++",url: "https://res.cloudinary.com/djpbqetkj/image/upload/v1736413420/pngwing.com_36_z4z6ur.png"}
]

interface RealTimeHtmlProps {
  device: 'mobile' | 'laptop'
}

export function RealTimeHtml({ device }: RealTimeHtmlProps) {
  const searchParams = useSearchParams();
  const { formData, selectedSkills } = useFormContext();
  const iframeRef = useSharedIframeRef();

  useEffect(() => {
    getIframeRef = iframeRef
  }, [iframeRef])

  useEffect(() => {
    if (!searchParams) {
      console.error("No search params found, kindly provide a username");
      return;
    }
  }, [searchParams]);

  

  useEffect(() => {
    const updateIframeContent = () => {
      const iframe = iframeRef.current;
      if (!iframe?.contentWindow) return;

      const iframeDocument = iframe.contentWindow.document;

      const bio = iframeDocument.getElementById("info-para")?.textContent;
   
      const projectOneTitle = iframeDocument.getElementById("project-one-title");
     
      const email = (iframeDocument.getElementById("user-email") as HTMLAnchorElement)?.href;
      let resume = (iframeDocument.getElementById("resume") as HTMLAnchorElement)

      if (projectOneTitle) {
        projectOneTitle.textContent = formData.name;

        if (bio) {
          iframeDocument.getElementById("info-para")!.textContent = formData.bio;
        }

        if (formData.bio) {
          const bioElement = iframeDocument.getElementById("info-para")
          if (bioElement) {
            bioElement.textContent = formData.bio
          }
        }

        if (formData.aboutMe) {
          const aboutMeElement = iframeDocument.getElementById("about-me");
          if (aboutMeElement) {
            aboutMeElement.textContent = formData.aboutMe;
          }
        }

        if (formData.name) {
          const nameElement = iframeDocument.getElementById("name")
          if (nameElement) {
            nameElement.textContent = formData.name
          }
        }

        if (formData.profession) {
          const professionElement = iframeDocument.getElementById("profession")
          if (professionElement) {
            professionElement.textContent = formData.profession
          }

        }

        if (resume) {
          resume = formData.resume
        }


        if (formData.skills) {
          const skillsElement = iframeDocument.getElementById('techStackWrapper');
          //iframeDocument.innerHTML = ''; // Clear existing items

          // Clear existing items
          while (skillsElement?.firstChild) {
            skillsElement.removeChild(skillsElement?.firstChild)
          }

          // Filter skills based on selectedSkills array
          const filteredSkills = skillsData.filter(skill =>
            selectedSkills.includes(skill.id.toUpperCase())
          );

          // Create elements for filtered skills
          filteredSkills.forEach(skill => {
            const li = iframeDocument.createElement('li');
            li.className = 'tech-stack-box';
            li.setAttribute('data-aos', 'fade-up');

            const img = iframeDocument.createElement('img');
            img.src = skill.url;
            img.alt = `${skill.id} skill`;
            img.className = 'tech-stack-logo';

            li.appendChild(img);
            skillsElement?.appendChild(li);
          })
        }

        if (formData.photo) {
          const imageElement = iframeDocument.getElementById("about-me-image") as HTMLImageElement;
          if (imageElement) {
            // Check if formData.photo is a File or Blob, and create an object URL, otherwise use the URL directly
            const imageSrc = formData.photo instanceof Blob ? URL.createObjectURL(formData.photo) : formData.photo;

            imageElement.src = imageSrc;

            // Log the image source URL
          } else {
            console.warn("Element with ID 'about-me-image' not found.");
          }
        } else {
          console.warn("No photo data found in formData.");
        }

        if (formData.projects) {
          if (formData.projects[0]?.photo) {
            const image = formData.projects[0].photo;
            const imageSrc = image instanceof Blob ? URL.createObjectURL(image) : image;

            (iframeDocument.getElementById("project-one-image") as HTMLImageElement)!.src =
              imageSrc;
          }
          if (formData.projects[1]?.photo) {
            const imageTwo = formData.projects[1].photo
            const imageTwoSrc = imageTwo instanceof Blob ? URL.createObjectURL(imageTwo) : imageTwo;

            (iframeDocument.getElementById("project-two-image") as HTMLImageElement)!.src =
              imageTwoSrc;
          }
          if (formData.projects[2]?.photo) {
            const imageThree = formData.projects[2].photo
            const imageThreeSrc = imageThree instanceof Blob ? URL.createObjectURL(imageThree) : imageThree;

            (iframeDocument.getElementById("project-three-image") as HTMLImageElement)!.src =
              imageThreeSrc;
          }
        }

        if (formData.projects) {
          if (formData.projects[0]?.title) {
            const projectOneTitleElement = iframeDocument.getElementById("project-one-title");
            if (projectOneTitleElement) {
              projectOneTitleElement.textContent = formData.projects[0].title;
            }
          }

          if (formData.projects[1]?.title) {
            const projectTwoTitleElement = iframeDocument.getElementById("project-two-title");
            if (projectTwoTitleElement) {
              projectTwoTitleElement.textContent = formData.projects[1].title;
            }
          }

          if (formData.projects[2]?.title) {
            const projectThreeTitleElement = iframeDocument.getElementById("project-three-title");
            if (projectThreeTitleElement) {
              projectThreeTitleElement.textContent = formData.projects[2].title;
            }
          }
        }

        if (formData.projects) {
          if (formData.projects[0]?.description) {
            const projectOneDescriptionElement = iframeDocument.getElementById("project-one-description");
            if (projectOneDescriptionElement) {
              projectOneDescriptionElement.textContent = formData.projects[0].description;
            }
          }

          if (formData.projects[1]?.description) {
            const projectTwoDescriptionElement = iframeDocument.getElementById("project-two-description");
            if (projectTwoDescriptionElement) {
              projectTwoDescriptionElement.textContent = formData.projects[1].description;
            }
          }

          if (formData.projects[2]?.description) {
            const projectThreeDescriptionElement = iframeDocument.getElementById("project-three-description");
            if (projectThreeDescriptionElement) {
              projectThreeDescriptionElement.textContent = formData.projects[2].description;
            }
          }
        }

        if (formData.projects) {
          if (formData.projects[0]?.repoLink) {
            const projectOneGithubRepoElement = iframeDocument.getElementById("project-one-githubRepo") as HTMLAnchorElement;
            if (projectOneGithubRepoElement) {
              projectOneGithubRepoElement.href = formData.projects[0].repoLink;
            }
          }

          if (formData.projects[1]?.repoLink) {
            const projectTwoGithubRepoElement = iframeDocument.getElementById("project-two-githubRepo") as HTMLAnchorElement;
            if (projectTwoGithubRepoElement) {
              projectTwoGithubRepoElement.href = formData.projects[1].repoLink;
            }
          }

          if (formData.projects[2]?.repoLink) {
            const projectThreeGithubRepoElement = iframeDocument.getElementById("project-three-githubRepo") as HTMLAnchorElement;
            if (projectThreeGithubRepoElement) {
              projectThreeGithubRepoElement.href = formData.projects[2].repoLink;
            }
          }
        }



        if (formData.projects) {
          if (formData.projects[0]?.liveLink) {
            const projectOneLiveLinkElement = iframeDocument.getElementById("project-one-liveLink") as HTMLAnchorElement;
            if (projectOneLiveLinkElement) {
              projectOneLiveLinkElement.href = formData.projects[0].liveLink;
            }
          }

          if (formData.projects[1]?.liveLink) {
            const projectTwoLiveLinkElement = iframeDocument.getElementById("project-two-liveLink") as HTMLAnchorElement;
            if (projectTwoLiveLinkElement) {
              projectTwoLiveLinkElement.href = formData.projects[1].liveLink;
            }
          }

          if (formData.projects[2]?.liveLink) {
            const projectThreeLiveLinkElement = iframeDocument.getElementById("project-three-liveLink") as HTMLAnchorElement;
            if (projectThreeLiveLinkElement) {
              projectThreeLiveLinkElement.href = formData.projects[2].liveLink;
            }
          }
        }



        if (formData.socialLinks) {
          if (formData.socialLinks[0]?.url) {
            const linkedinUrlElement = iframeDocument.getElementById("linkedin-url") as HTMLAnchorElement;
            if (linkedinUrlElement) {
              linkedinUrlElement.href = formData.socialLinks[0].url;
            }
          }

          if (formData.socialLinks[1]?.url) {
            const githubUrlElement = iframeDocument.getElementById("github-url") as HTMLAnchorElement;
            if (githubUrlElement) {
              githubUrlElement.href = formData.socialLinks[1].url;
            }
          }
        }

        if (email) {
          (iframeDocument.getElementById("user-email") as HTMLAnchorElement)!.href =
            formData.email;
        }

      };

      // Helper function to update anchor href
      const updateAnchorHref = (id: string, value?: string) => {
        const anchorElement = iframeDocument.getElementById(id) as HTMLAnchorElement;
        if (anchorElement && value) anchorElement.href = value;
      };

      // Update basic information
      //  updateTextContent("info-para", formData.bio);
      //  updateTextContent("about-me", formData.aboutMe);
      //  updateImageSrc("about-me-image", formData.aboutMeImage);

      // Update projects
      formData.projects?.forEach((project, index) => {
        const num = index + 1;
        //    updateTextContent(`project-${num}-title`, project.title);
        //    updateTextContent(`project-${num}-description`, project.description);
        //    updateImageSrc(`project-${num}-image`, project.photo);
        updateAnchorHref(`project-${num}-githubRepo`, project.repoLink);
        updateAnchorHref(`project-${num}-liveLink`, project.liveLink);
      });

      // Update social links
      formData.socialLinks?.forEach((link, index) => {
        if (index === 0) updateAnchorHref("linkedin-url", link.url);
        if (index === 1) updateAnchorHref("github-url", link.url);
      });

      // Update email
      updateAnchorHref("user-email", formData.email);
    };

    // Update content immediately if iframe is already loaded
    updateIframeContent();

    // Set up a message listener for when the iframe is ready
    const handleMessage = (event: MessageEvent) => {
      if (event.data === "iframeReady") {
        updateIframeContent();
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [formData]);

  return (

    <div className={`w-full h-full bg-gray-100 rounded-lg ${device === 'laptop' ? 'max-w-sm mx-auto' : ''}`}>
    <iframe
      ref={iframeRef}
      id="template"
      src={`/index.html?${searchParams.toString()}`}
      className={`w-full border-none ${device === 'mobile' ? 'h-[800px]' : 'h-full'}`}
      title={`${device} preview`}
    />
  </div>


   
  );
}

