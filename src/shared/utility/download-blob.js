import FileSaver from 'file-saver';

const downloadBlob = (blob, fileName) => FileSaver.saveAs(blob, fileName);

export default downloadBlob;
