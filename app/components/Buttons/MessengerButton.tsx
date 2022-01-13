import { Button } from 'reactstrap';

type MessengerButtonProps = {
  name: string,
  title?: string,
  disabled?: boolean,
  clickHandler?: () => void,
  color?: string,
  className?: string,
  type?: 'submit' | 'reset' | 'button' | undefined;
}
const MessengerButton = ({name, title, disabled, clickHandler, color, className, type}: MessengerButtonProps) => {
  return (
      <Button
        color={color ? color : 'info'}
        disabled={disabled}
        title={title}
        className={className}
        type={type}
        name={name}
        onClick={clickHandler}
      >
        {name}
      </Button>
  );
};

export default MessengerButton;
