import * as docx from 'docx';
import file_saver from 'file-saver'
const { saveAs } = file_saver
// Load the full build.
import lodash from 'lodash';
const { TableRow,BorderStyle } = docx;
const { WidthType,Paragraph } = docx;
const { VerticalAlign, Document } = docx;
const { TextRun, AlignmentType } = docx;
const { SectionType, Header } = docx;
const { HeightRule,TableCell } = docx;
const { Footer, LineRuleType } = docx;
const { Table, PageBreak } = docx;
const { HeadingLevel,Packer } = docx;

