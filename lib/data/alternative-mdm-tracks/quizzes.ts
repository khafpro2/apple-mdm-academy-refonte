import { allAltMdmModules } from "@/lib/data/alternative-mdm-tracks/module-definitions";
import { createAllModuleQuizzes } from "@/lib/data/alternative-mdm-tracks/quiz-factory";

export const altMdmModuleQuizzes = createAllModuleQuizzes(allAltMdmModules);
