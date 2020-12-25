import React from 'react';
import PropTypes from 'prop-types';
import Checkbox from 'shared/components/checkbox';
import Radio from 'shared/components/radio';
import classNames from 'classnames';
import { enums } from '2020-qb4';
import 'modules/prompts/_mcma-prompt.scss';

const PromptTypes = enums.promptTypes;

const PromptMCMA = ({
  task,
}) => {
  const instructionText = PromptTypes[task.type] === PromptTypes.multipleChoice ?
    'Select 1 option:' :
    getMultipleAnswerInstructions(task.minimumOptionsRequired, task.maximumOptionsLimit);

  const optionsClasses = classNames({
    'mcma-options-list': true,
    wrap: task.autoWrapOptions,
  });

  const renderOption = createRenderOption(PromptTypes[task.type]);

  return (
    <div className="mcma-prompt-wrapper">
      <h6 className="item-content-label">
        {instructionText}
      </h6>
      <div className={optionsClasses}>
        {task.options.map(renderOption)}
      </div>
    </div>
  );
};

PromptMCMA.propTypes = {
  task: PropTypes.object.isRequired,
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

function getMultipleAnswerInstructions(min = 1, max = null) {
  if (max === null) { // only minimum:
    return `Select at least ${min} option${(min === 1) ? '' : 's'}:`;
  } else if (min === max) { // minimum and maximum are the same
    return `Select ${min} options:`;
  } // minimum and maximum are different.
  return `Select ${min} to ${max} options:`;
}

export default PromptMCMA;
