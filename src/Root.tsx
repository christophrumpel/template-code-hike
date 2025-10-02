import { Composition } from "remotion";
import { Main } from "./Main";

import { calculateMetadata } from "./calculate-metadata/calculate-metadata";
import { schema } from "./calculate-metadata/schema";
import { SequenceItem } from "./sequence-config";

export const RemotionRoot = () => {
  return (
    <Composition
      id="Main"
      component={Main}
      defaultProps={{
        sequences: null,
        themeColors: null,
        theme: "dracula" as const,
        codeWidth: null,
        width: {
          type: "auto",
        },
        sequenceConfig: null as SequenceItem[] | null,
      }}
      fps={30}
      height={1080}
      calculateMetadata={calculateMetadata}
      schema={schema}
    />
  );
};
