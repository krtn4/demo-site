import { SplitChars } from './Ornaments';

/** The reference's centred display title with its short gold rule, revealed character by character. */
export function SectionTitle({ children, id }: { children: string; id?: string }) {
  return (
    <div className="title-wrap">
      <h2 className="title" id={id} data-reveal="chars">
        <SplitChars text={children} />
      </h2>
      <span className="title-rule" data-reveal="rule" aria-hidden="true" />
    </div>
  );
}
