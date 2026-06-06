import type { Question } from "@/lib/types";
import { shuffleArray } from "@/lib/quiz/seeded-random";

let positionCounter = 0;

/** Réinitialise le compteur de position (tests / génération par lot). */
export function resetQuestionPositionCounter() {
  positionCounter = 0;
}

function nextTargetIndex(): 0 | 1 | 2 | 3 {
  const idx = positionCounter % 4;
  positionCounter++;
  return idx as 0 | 1 | 2 | 3;
}

type BuildQuestionInput = {
  id: string;
  text: string;
  correct: string;
  distractors: [string, string, string];
  explanation: string;
  targetIndex?: 0 | 1 | 2 | 3;
  selectMultiple?: boolean;
  correctIndices?: number[];
  moduleHref?: string;
  moduleLabel?: string;
};

/** Construit une question avec placement équilibré de la bonne réponse. */
export function buildQuestion(input: BuildQuestionInput): Question {
  const target = input.targetIndex ?? nextTargetIndex();
  const distractors = shuffleArray([...input.distractors], `${input.id}-d`);
  const options: string[] = [];
  let d = 0;
  for (let i = 0; i < 4; i++) {
    if (i === target) options.push(input.correct);
    else options.push(distractors[d++]!);
  }

  const question: Question = {
    id: input.id,
    text: input.text,
    options,
    correctIndex: target,
    explanation: input.explanation,
    moduleHref: input.moduleHref,
    moduleLabel: input.moduleLabel,
  };

  if (input.selectMultiple && input.correctIndices) {
    question.selectMultiple = true;
    question.correctIndices = input.correctIndices;
  }

  return question;
}

/** Helper rétrocompatible pour les pools existants — placement cyclique A→D. */
export function q(
  id: string,
  text: string,
  options: [string, string, string, string],
  correct: 0 | 1 | 2 | 3,
  explanation: string,
  extra?: Partial<Question>
): Question {
  const correctText = options[correct];
  const distractors = options.filter((_, i) => i !== correct) as [string, string, string];
  return buildQuestion({
    id,
    text,
    correct: correctText,
    distractors,
    explanation,
    targetIndex: nextTargetIndex(),
    ...extra,
  });
}

/** Question à choix multiples (2+ bonnes réponses). */
export function qMulti(
  id: string,
  text: string,
  options: string[],
  correctTexts: string[],
  explanation: string
): Question {
  const correctSet = new Set(correctTexts);
  const correctIndices = options
    .map((opt, i) => (correctSet.has(opt) ? i : -1))
    .filter((i) => i >= 0);

  return {
    id,
    text,
    options: [...options],
    correctIndex: correctIndices[0] ?? 0,
    correctIndices,
    selectMultiple: true,
    explanation,
  };
}
