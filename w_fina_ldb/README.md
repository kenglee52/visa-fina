# ລະບົບຈັດການຂໍ້ມູນຜູ້ຂໍບັດເຄຣດິດ FINA LBB (KYC System)

ລະບົບຈັດການຂໍ້ມູນຜູ້ສະໝັກບັດເຄຣດິດ VISA ແລະ GIF Fina ສ້າງດ້ວຍ React + Vite

## ເຕັກໂນໂລຊີທີ່ໃຊ້

- **Frontend:** React 18 + Vite
- **UI Components:** shadcn/ui + TailwindCSS
- **Routing:** React Router v6
- **HTTP Client:** Axios
- **Notifications:** Sonner (Toast)
- **Icons:** Lucide React
- **Date Handling:** date-fns, react-datepicker

## ໂຄງສ້າງໂຟນເດີໂຄງສ້າງ

```
w_fina_ldb/
├── src/
│   ├── pages/              # ໜ້າຕ່າງໆຂອງລະບົບ
│   │   ├── Login.jsx                   # ໜ້າເຂົ້າສູ່ລະບົບ
│   │   ├── EditApplicant.jsx          # ໜ້າແກ້ໄຂຂໍ້ມູນຜູ້ສະໝັກ (ໜ້າເດັດ)
│   │   ├── data_entry/                # ໜ້າສຳລັບພະນັກງານຂັ້ນຂໍ້ມູນ
│   │   │   ├── Data_entry.jsx         # ໜ້າບັນທຶກຂໍ້ມູນຜູ້ສະໝັກໃໝ່
│   │   │   └── Follow_status.jsx      # ໜ້າຕິດຕາມສະຖານະຜູ້ສະໝັກ
│   │   ├── verifier/                  # ໜ້າສຳລັບຜູ້ກວດສອບ
│   │   │   ├── Verifier_confirm.jsx  # ໜ້າກວດສອບບັດ
│   │   │   ├── Issued.jsx             # ໜ້າບັດທີ່ອອກແລ້ວ
│   │   │   ├── Received.jsx           # ໜ້າບັດທີ່ຮັບແລ້ວ
│   │   │   └── View_log.jsx           # ໜ້າເບິ່ງບັນທຶກການດຳເນີນ
│   │   └── admin/                     # ໜ້າສຳລັບຜູ້ບໍລິຫານ
│   │       ├── Dasdbord.jsx          # ໜ້າ Dashboard
│   │       └── page/
│   │           ├── Provinces.jsx     # ຈັດການຂໍ້ມູນແຂວງ
│   │           ├── Districts.jsx     # ຈັດການຂໍ້ມູນເມືອງ
│   │           └── Employee.jsx      # ຈັດການພະນັກງານ
│   │
│   ├── LayOut/              # ໂຄງສ້າງ Layout ຕ່າງໆ
│   │   ├── Layout_data_entry.jsx      # Layout ສຳລັບພະນັກງານຂັ້ນຂໍ້ມູນ
│   │   ├── Layot_verifier.jsx        # Layout ສຳລັບຜູ້ກວດສອບ
│   │   ├── Dasdbord_admin.jsx         # Layout ສຳລັບ Admin
│   │   └── LayOut_Management.jsx      # Layout ສຳລັບ Management
│   │
│   ├── components/          # ສ່ວນປະກອບ UI
│   │   ├── ui/                        # ສ່ວນປະກອບ shadcn/ui
│   │   │   ├── button.jsx, input.jsx, card.jsx, table.jsx, dialog.jsx, ...
│   │   ├── common/                    # ສ່ວນປະກອບທົ່ວໄປ
│   │   │   ├── LoadingSpinner.jsx     # ໄອຄອນໂຫຼດ
│   │   │   ├── StatusBadge.jsx        # ປ້າຍສະຖານະ
│   │   │   ├── FileUpload.jsx         # ອັບໂຫຼດໄຟລ໌
│   │   │   ├── ConfirmDialog.jsx      # ການຢືນຢັນ
│   │   │   └── DateInput.jsx          # ປ້ອນວັນທີ່
│   │   └── applicant/                 # ສ່ວນປະກອບຜູ້ສະໝັກ
│   │       └── ApplicantEditForm.jsx  # ແບບຟອມແກ້ໄຂຜູ້ສະໝັກ
│   │
│   ├── hooks/               # Custom Hooks
│   │   ├── auth/
│   │   │   └── useAuth.jsx            # Hook ຈັດການ Authentication
│   │   ├── form/
│   │   │   ├── useForm.js             # Hook ຈັດການຟອມ
│   │   │   └── useFileUpload.js        # Hook ອັບໂຫຼດໄຟລ໌
│   │   ├── ui/
│   │   │   ├── useToast.js            # Hook ແຈ້ງເຕືອນ
│   │   │   └── useConfirmDialog.js    # Hook ຢືນຢັນ
│   │   └── api/
│   │       ├── useApiCall.js          # Hook ເອີ້ນ API
│   │       ├── useMutation.js         # Hook ດຳການ Mutation
│   │       └── usePaginatedData.js    # Hook ຂໍ້ມູນແບບແບນ
│   │
│   ├── api/                 # API Services
│   │   ├── auth.api.js               # API ເຂົ້າສູ່ລະບົບ
│   │   ├── applicant.api.js          # API ຈັດການຜູ້ສະໝັກ
│   │   ├── document.api.js           # API ຈັດການເອກະສານ
│   │   ├── location.api.js           # API ຂໍ້ມູນສະຖານທີ່
│   │   ├── admin.api.js              # API ຈັດການ Admin
│   │   └── index.js                  # Export ທັງໝົດ API
│   │
│   ├── contexts/            # Context Providers
│   │   ├── ToastContext.jsx          # Context ແຈ້ງເຕືອນ
│   │   └── index.js
│   │
│   ├── config/               # ການຕັ້ງຄ່າ
│   │   ├── constants.js              # ຄ່າ ຄົງທີ່ (ROUTES, ROLES, messages)
│   │   ├── api.config.js             # ການຕັ້ງຄ່າ API
│   │   └── env.config.js             # ການຕັ້ງຄ່າ Environment
│   │
│   ├── routes/               # Routes
│   │   └── AppRoute.jsx              # ການຈັດການ Route ທັງໝົດ
│   │
│   ├── lib/                 # Utilities
│   │   └── utils.js                  # ຟັງຊັນ ເບິ່ງໃຊ້
│   │
│   ├── data/                # ຂໍ້ມູນ Static
│   │   └── translations.js           # ຄໍາແປພາສາ
│   │
│   ├── App.jsx               # Root Component
│   ├── main.jsx              # Entry Point
│   └── index.css             # Global Styles
│
├── package.json             # Dependencies
├── vite.config.js           # Vite Configuration
├── tailwind.config.js       # TailwindCSS Configuration
└── README.md                # ເອກະສານນີ້
```

## ຄຸນນະສົດຂອງລະບົບ

### ສຳລັບພະນັກງານຂັ້ນຂໍ້ມູນ (Data Entry)
- ບັນທຶກຂໍ້ມູນຜູ້ສະໝັບໃໝ່
- ຕິດຕາມສະຖານະການອະນຸມັດ
- ແກ້ໄຂຂໍ້ມູນຜູ້ສະໝັກ
- ອັບໂຫຼດເອກະສານ PDF

### ສຳລັບຜູ້ກວດສອບ (Verifier)
- ກວດສອບຂໍ້ມູນຜູ້ສະໝັກ
- ອະນຸມັດ ຫຼື ປະຕິເສດ
- ເບິ່ງບັດທີ່ອອກແລ້ວ
- ເບິ່ງບັດທີ່ຮັບແລ້ວ
- ເບິ່ງບັນທຶກການດຳເນີນ

### ສຳລັບ Admin
- ເບິ່ງບັນທຶກການດຳເນີນ
- ຈັດການຂໍ້ມູນແຂວງ/ເມືອງ
- ຈັດການພະນັກງານ
- Dashboard ສະຫຼຸບສະຖິຕິ

## ການຕິດຕັ້ງ

### ຂໍ້ຈຳເປັນ
- Node.js v18 ຫຼື ສູງກວ່າ
- npm ຫຼື yarn

### ຂັ້ນຕອນການຕິດຕັ້ງ

1. Clone ໂຄງສ້າງໂຄງສ້າງ
```bash
git clone <repository-url>
cd w_fina_ldb
```

2. ຕິດຕັ້ງ dependencies
```bash
npm install
```

3. ເລີ່ມໂຄງສ້າງໃນ mode development
```bash
npm run dev
```

4. ເປີດເບຣາວເຊີໃນ http://localhost:5173

## ສະຄຣິບສຳລັບໃຊ້ງານ

```bash
# ເລີ່ມ development server
npm run dev

# Build ສຳລັບ production
npm run build

# Preview ຜົນຂອງ build
npm run preview

# Run linting
npm run lint
```

## ບົດບາດຜູ້ໃຊ້ງານ

ລະບົບມີ 4 ບົດບາດຫຼັກ:

1. **Admin** - ຜູ້ບໍລິຫານລະບົບ
   - ເຂົ້າເຖິງ Dashboard
   - ຈັດການພະນັກງານ
   - ຈັດການຂໍ້ມູນແຂວງ/ເມືອງ

2. **Data Entry** - ພະນັກງານຂັ້ນຂໍ້ມູນ
   - ບັນທຶກຂໍ້ມູນຜູ້ສະໝັກໃໝ່
   - ແກ້ໄຂຂໍ້ມູນຜູ້ສະໝັກ
   - ຕິດຕາມສະຖານະ

3. **Verifier** - ຜູ້ກວດສອບ
   - ກວດສອບຄຳຂໍອະນຸມັດ
   - ອະນຸມັດ ຫຼື ປະຕິເສດ
   - ອອກບັດ

4. **Receiver** - ຜູ້ຮັບບັດ
   - ຈັດການການສົ່ງມອບບັດ

## ການຕັ້ງຄ່າ Environment

ສ້າງໄຟລ໌ `.env` ໃນໂຟນເດີ root:

```env
VITE_API_BASE_URL=http://localhost:3000
```

## ເຕັກໂນໂລຊີທີ່ໃຊ້

- **Frontend Framework:** React 18
- **Build Tool:** Vite 5
- **Styling:** TailwindCSS
- **UI Components:** shadcn/ui
- **Routing:** React Router v6
- **HTTP:** Axios
- **Date:** date-fns, react-datepicker
- **Icons:** Lucide React
- **Notifications:** Sonner
- **Forms:** Custom hooks (useForm, useFileUpload)

## ໂຄງສ້າງໜ້າຕ່າງໆ

| ໜ້າ | Path | ບົດບາດ |
|-----|-----|--------|
| Login | `/` | ທຸກບົດບາດ |
| ບັນທຶກຜູ້ສະໝັກ | `/data-entry/applicants` | Data Entry |
| ຕິດຕາມສະຖານະ | `/data-entry/status` | Data Entry |
| ແກ້ໄຂຜູ້ສະໝັກ | `/data-entry/edit/:id` | Data Entry |
| ກວດສອບບັດ | `/verifier/verifie-check` | Verifier |
| ບັດທີ່ອອກແລ້ວ | `/verifier/verifie-issued` | Verifier |
| ບັດທີ່ຮັບແລ້ວ | `/verifier/verifie-received` | Verifier |
| ເບິ່ງ Log | `/verifier/verifie-view-log` | Verifier |
| Dashboard | `/admin-dasdbord` | Admin |
| ແຂວງ | `/admin-dasdbord/management` | Admin |
| ເມືອງ | `/admin-dasdbord/management/districts` | Admin |
| ພະນັກງານ | `/admin-dasdbord/management/employee` | Admin |

## ເອກະສານເພີ່ມເຕີມ

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [TailwindCSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)

---

ພັດທະນາ ໂດຍ FINA LBB Team © 2026
