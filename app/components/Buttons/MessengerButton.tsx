import { Button } from 'reactstrap';

type MessengerButtonProps = {
  name: string,
  title?: string,
  disabled?: boolean,
  clickHandler: () => void,
  color?: string,
  className?: string,
  type?: 'submit' | 'reset' | 'button' | undefined;
}
const MessengerButton = ({name, title, disabled, clickHandler, color, className, type}: MessengerButtonProps) => {
  return (
      <Button
        color={color ? color : 'info'}
        disabled={disabled}
        onClick={() => {console.log('****Click Handler Called******')}}
        title={title}
        className={className}
        type={type}
      >
        {name}
      </Button>
  );
};

export default MessengerButton;
