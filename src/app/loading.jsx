import CustomCard from '@/components/cards/CustomCard';
import ButtonLoading from '@/components/form-component/ButtonLoading';

const Loading = () => {
  return (
    <div className="w-full h-full flex min-h-screen items-center justify-center">
      <CustomCard>
        <ButtonLoading />
      </CustomCard>
    </div>
  );
};

export default Loading;
