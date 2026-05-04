import api from './api';

const getBeneficiaries = async () => {
  const response = await api.get('/beneficiaries');
  return response.data;
};

const saveBeneficiary = async (beneficiary) => {
  const response = await api.post('/beneficiaries', beneficiary);
  return response.data;
};

const deleteBeneficiary = async (id) => {
  const response = await api.delete(`/beneficiaries/${id}`);
  return response.data;
};

export { getBeneficiaries, saveBeneficiary, deleteBeneficiary };