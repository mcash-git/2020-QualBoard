import React from 'react';
import PropTypes from 'prop-types';
import { enums } from '2020-qb4';
import Checkbox from 'shared/components/checkbox';
import Radio from 'shared/components/radio';

const PromptTypes = enums.promptTypes;

const PromptResponseMcma = ({ task, response }) => {
  const renderOption = createRenderOption(PromptTypes[task.type]);

  return (
    <div className="mcma-options-list">
      {response.options.map(renderOption)}
    </div>
  );
};

PromptResponseMcma.propTypes = {
  task: PropTypes.object.isRequired,
  response: PropTypes.object.isRequired,
};

function createRenderOption(type) {
  const renderInput = (type === PromptTypes.multipleChoice) ?
    (o) => <Radio radioId={o.id} labelText={o.text} isChecked={false} /> :
    (o) => <Checkbox checkboxId={o.id} labelText={o.text} isChecked={false} />;

  return (o) => (
    <div className="mcma-option" key={o.optionId}>
      {renderInput(o)}
    </div>
  );
}

export default PromptResponseMcma;
