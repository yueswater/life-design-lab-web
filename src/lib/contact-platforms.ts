import { faLine, faWhatsapp, faFacebookMessenger } from '@fortawesome/free-brands-svg-icons';
import { faPhone } from '@fortawesome/free-solid-svg-icons';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { Localized } from '../types';

export interface ContactPlatformOption {
  id: 'line' | 'whatsapp' | 'messenger' | 'phone';
  label: Localized;
  placeholder: Localized;
  icon: IconDefinition;
}

export const CONTACT_PLATFORMS: ContactPlatformOption[] = [
  {
    id: 'line',
    label: { zh: 'Line', en: 'Line' },
    icon: faLine,
    placeholder: { zh: 'Line ID', en: 'Line ID' },
  },
  {
    id: 'whatsapp',
    label: { zh: 'WhatsApp', en: 'WhatsApp' },
    icon: faWhatsapp,
    placeholder: { zh: '手機號碼', en: 'Mobile number' },
  },
  {
    id: 'messenger',
    label: { zh: 'Messenger', en: 'Messenger' },
    icon: faFacebookMessenger,
    placeholder: { zh: 'Facebook 帳號名稱', en: 'Facebook account name' },
  },
  {
    id: 'phone',
    label: { zh: '電話', en: 'Phone' },
    icon: faPhone,
    placeholder: { zh: '手機號碼', en: 'Mobile number' },
  },
];
