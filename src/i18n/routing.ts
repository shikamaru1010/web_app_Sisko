import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["sr", "en"],
  defaultLocale: "sr",
  pathnames: {
    "/": "/",
    "/meni": {
      sr: "/meni",
      en: "/menu",
    },
    "/o-nama": {
      sr: "/o-nama",
      en: "/about",
    },
    "/galerija": {
      sr: "/galerija",
      en: "/gallery",
    },
    "/kontakt": {
      sr: "/kontakt",
      en: "/contact",
    },
    "/lokacija": {
      sr: "/lokacija",
      en: "/location",
    },
    "/zabava": {
      sr: "/zabava",
      en: "/fun",
    },
    "/zabava/kviz": {
      sr: "/zabava/kviz",
      en: "/fun/quiz",
    },
    "/zabava/kviz-deca": {
      sr: "/zabava/kviz-deca",
      en: "/fun/kids-quiz",
    },
    "/zabava/memory": {
      sr: "/zabava/memory",
      en: "/fun/memory",
    },
    "/zabava/sastavi-obrok": {
      sr: "/zabava/sastavi-obrok",
      en: "/fun/build-meal",
    },
    "/korpa": {
      sr: "/korpa",
      en: "/cart",
    },
  },
});

export type Pathnames = keyof typeof routing.pathnames;
