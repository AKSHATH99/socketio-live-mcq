import {
  Atom,
  BookOpen,
  Calculator,
  Code2,
  FlaskConical,
  Globe2,
  Landmark,
  Microscope,
} from "lucide-react";

export const TEST_ICONS = [
  FlaskConical,
  Calculator,
  BookOpen,
  Landmark,
  Globe2,
  Code2,
  Atom,
  Microscope,
];

export const getTestVisual = (test) => {
  const haystack = `${test?.title || ""} ${test?.description || ""}`.toLowerCase();

  if (/(math|algebra|geometry|calculus|equation|number)/.test(haystack)) return TEST_ICONS[1];
  if (/(bio|cell|organism|genetic|micro)/.test(haystack)) return TEST_ICONS[7];
  if (/(chem|lab|science|experiment)/.test(haystack)) return TEST_ICONS[0];
  if (/(phys|atom|force|motion|energy)/.test(haystack)) return TEST_ICONS[6];
  if (/(history|civic|social|politic)/.test(haystack)) return TEST_ICONS[3];
  if (/(geo|map|climate|earth)/.test(haystack)) return TEST_ICONS[4];
  if (/(english|literature|grammar|language|read)/.test(haystack)) return TEST_ICONS[2];
  if (/(computer|code|program|tech|web)/.test(haystack)) return TEST_ICONS[5];

  const seed = String(test?.id || test?.title || "test")
    .split("")
    .reduce((sum, char) => sum + char.charCodeAt(0), 0);

  return TEST_ICONS[seed % TEST_ICONS.length];
};
