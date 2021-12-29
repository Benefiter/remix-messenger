import { Button } from 'reactstrap';

type MessengerButtonProps = {
  name: string,
  title?: string,
  disabled?: boolean,
  clickHandler: () => void,
  color?: string,
  className?: string
}
const MessengerButton = ({name, title, disabled, clickHandler, color, className}: MessengerButtonProps) => {
  return (
      <Button
        color={color ? color : 'info'}
        disabled={disabled}
        onClick={clickHandler}
        title={title}
        className={className}
      >
        {name}
      </Button>
  );
};

export default MessengerButton;
