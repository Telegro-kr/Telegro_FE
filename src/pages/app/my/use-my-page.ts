import type { ChangeEvent, FormEvent } from 'react';
import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  telegroInvalidate,
  type DeliveryAddressDetailDTO,
  useAddDeliveryAddress,
  useAddDeliveryAddress1 as useDeleteDeliveryAddress,
  useGetMyPage,
  useGetOrders,
  useSetDefaultDeliveryAddress,
  useUpdateDeliveryAddress,
} from '@apis/telegro';
import { toastError, toastSuccess } from '@components/common/toast/toast';
import { INITIAL_ADDRESS_FORM, POSTCODE_SCRIPT_ID, POSTCODE_SCRIPT_SRC } from './my.constants';
import type { AddressForm, AddressModalState, MenuItem } from './my.types';
import { buildRoadAddress, getAddressForm, getApiErrorMessage, getDefaultAddress, toAddressPayload } from './my.utils';

export function useMyPage() {
  const queryClient = useQueryClient();
  const [activeMenu, setActiveMenu] = useState<MenuItem>('프로필');
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [addressModalState, setAddressModalState] = useState<AddressModalState>(null);
  const [addressToDelete, setAddressToDelete] = useState<DeliveryAddressDetailDTO | null>(null);
  const [isPostcodeReady, setIsPostcodeReady] = useState(false);
  const [addressForm, setAddressForm] = useState<AddressForm>(INITIAL_ADDRESS_FORM);

  const myPageQuery = useGetMyPage({ query: { staleTime: 60_000 } });
  const ordersQuery = useGetOrders({ page: 0, size: 4 }, { query: { staleTime: 60_000 } });
  const addAddressMutation = useAddDeliveryAddress();
  const updateAddressMutation = useUpdateDeliveryAddress();
  const deleteAddressMutation = useDeleteDeliveryAddress();
  const setDefaultAddressMutation = useSetDefaultDeliveryAddress();

  useEffect(() => {
    if (window.daum?.Postcode) {
      setIsPostcodeReady(true);
      return;
    }

    const existingScript = document.getElementById(POSTCODE_SCRIPT_ID) as HTMLScriptElement | null;
    const handleLoad = () => setIsPostcodeReady(true);

    if (existingScript) {
      existingScript.addEventListener('load', handleLoad, { once: true });
      return () => existingScript.removeEventListener('load', handleLoad);
    }

    const script = document.createElement('script');
    script.id = POSTCODE_SCRIPT_ID;
    script.src = POSTCODE_SCRIPT_SRC;
    script.async = true;
    script.addEventListener('load', handleLoad, { once: true });
    document.body.appendChild(script);

    return () => script.removeEventListener('load', handleLoad);
  }, []);

  const user = myPageQuery.data?.data;
  const addresses = [...(user?.addressList ?? [])].sort((a, b) => Number(b.isDefault) - Number(a.isDefault));
  const defaultAddress = getDefaultAddress(addresses);
  const recentOrders = ordersQuery.data?.data?.orders ?? [];

  const isAddressMutationPending =
    addAddressMutation.isPending ||
    updateAddressMutation.isPending ||
    deleteAddressMutation.isPending ||
    setDefaultAddressMutation.isPending;

  const invalidateMyPage = async () => {
    await telegroInvalidate.myPage(queryClient);
  };

  const openCreateAddress = () => {
    setAddressForm(INITIAL_ADDRESS_FORM);
    setAddressModalState({ mode: 'create' });
  };

  const openEditAddress = (address: DeliveryAddressDetailDTO) => {
    setAddressForm(getAddressForm(address));
    setAddressModalState({ mode: 'edit', address });
  };

  const closeAddressModal = () => {
    if (isAddressMutationPending) return;
    setAddressModalState(null);
    setAddressForm(INITIAL_ADDRESS_FORM);
  };

  const handleAddressChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setAddressForm((prev) => ({ ...prev, [name as keyof AddressForm]: value }));
  };

  const handleToggleDefault = () => {
    setAddressForm((prev) => ({ ...prev, isDefault: !prev.isDefault }));
  };

  const handleAddressSearch = () => {
    if (!window.daum?.Postcode) {
      toastError('주소 검색을 불러오는 중입니다. 잠시 후 다시 시도해 주세요.');
      return;
    }

    new window.daum.Postcode({
      oncomplete: (data) => {
        setAddressForm((prev) => ({
          ...prev,
          zipcode: data.zonecode,
          address: buildRoadAddress(data),
        }));
      },
    }).open();
  };

  const handleSetDefaultAddress = async (address: DeliveryAddressDetailDTO) => {
    if (!address.deliveryAddressId) {
      toastError('배송지 정보를 찾을 수 없습니다.');
      return;
    }

    try {
      await setDefaultAddressMutation.mutateAsync({ addressId: address.deliveryAddressId });
      await invalidateMyPage();
      toastSuccess('기본 배송지가 변경되었습니다.');
    } catch (error) {
      toastError(getApiErrorMessage(error, '기본 배송지 변경에 실패했습니다.'));
    }
  };

  const handleAddressSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!addressForm.name.trim()) return toastError('배송지명을 입력해 주세요.');
    if (!addressForm.recipientName.trim()) return toastError('받는 분 이름을 입력해 주세요.');
    if (!addressForm.phoneNumber.trim()) return toastError('연락처를 입력해 주세요.');
    if (!addressForm.zipcode.trim() || !addressForm.address.trim()) {
      return toastError('주소 검색을 통해 주소를 입력해 주세요.');
    }
    if (!addressForm.addressDetail.trim()) return toastError('상세 주소를 입력해 주세요.');

    try {
      if (addressModalState?.mode === 'edit') {
        const addressId = addressModalState.address.deliveryAddressId;
        if (!addressId) return toastError('수정할 배송지를 찾을 수 없습니다.');

        await updateAddressMutation.mutateAsync({
          addressId,
          data: toAddressPayload(addressForm),
        });

        if (addressForm.isDefault && !addressModalState.address.isDefault) {
          await setDefaultAddressMutation.mutateAsync({ addressId });
        }

        await invalidateMyPage();
        toastSuccess('배송지가 수정되었습니다.');
      } else {
        const response = await addAddressMutation.mutateAsync({
          data: toAddressPayload(addressForm),
        });

        const createdAddressId = response.data?.id;
        if (addressForm.isDefault && createdAddressId) {
          await setDefaultAddressMutation.mutateAsync({ addressId: createdAddressId });
        }

        await invalidateMyPage();
        toastSuccess('배송지가 추가되었습니다.');
      }

      closeAddressModal();
    } catch (error) {
      toastError(
        getApiErrorMessage(
          error,
          addressModalState?.mode === 'edit' ? '배송지 수정에 실패했습니다.' : '배송지 추가에 실패했습니다.',
        ),
      );
    }
  };

  const handleDeleteAddress = async () => {
    if (!addressToDelete?.deliveryAddressId) {
      setAddressToDelete(null);
      toastError('삭제할 배송지를 찾을 수 없습니다.');
      return;
    }

    try {
      await deleteAddressMutation.mutateAsync({ addressId: addressToDelete.deliveryAddressId });
      await invalidateMyPage();
      toastSuccess('배송지가 삭제되었습니다.');
    } catch (error) {
      toastError(getApiErrorMessage(error, '배송지 삭제에 실패했습니다.'));
    } finally {
      setAddressToDelete(null);
    }
  };

  return {
    activeMenu,
    addAddressMutation,
    addressForm,
    addressModalState,
    addressToDelete,
    addresses,
    closeAddressModal,
    defaultAddress,
    deleteAddressMutation,
    handleAddressChange,
    handleAddressSearch,
    handleAddressSubmit,
    handleDeleteAddress,
    handleSetDefaultAddress,
    handleToggleDefault,
    isAddressMutationPending,
    isLogoutModalOpen,
    isPostcodeReady,
    myPageQuery,
    openCreateAddress,
    openEditAddress,
    ordersQuery,
    recentOrders,
    setActiveMenu,
    setAddressToDelete,
    setIsLogoutModalOpen,
    updateAddressMutation,
    user,
  };
}
