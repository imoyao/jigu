'use client';

import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import { CloseIcon } from './Icons';
import { Alert, AlertDescription } from '@/components/ui/alert';

// 微信用户支持群活码（动态二维码），扫/点此链接进入微信入群页
const WECHAT_GROUP_QR_URL = 'https://open.weixin.qq.com/qr/code?username=idealyard';

export default function WeChatModal({ onClose }) {
  return (
    <motion.div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="微信用户支持群"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ zIndex: 10002 }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="glass card modal"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '360px', padding: '24px' }}
      >
        <div className="title" style={{ marginBottom: 20, justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span>💬 微信用户支持群</span>
          </div>
          <button className="icon-button" onClick={onClose} style={{ border: 'none', background: 'transparent' }}>
            <CloseIcon width="20" height="20" />
          </button>
        </div>
        <Alert style={{ marginBottom: 16 }} variant="warning">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>入群须知：禁止讨论和基金买卖以及投资的有关内容，可反馈软件相关需求。</AlertDescription>
        </Alert>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <a
            href={WECHAT_GROUP_QR_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              width: '100%',
              padding: '24px 16px',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              textDecoration: 'none',
              color: 'var(--primary)',
              background: 'var(--card)',
              fontSize: '15px',
              fontWeight: 600
            }}
          >
            <span style={{ fontSize: '28px' }}>💬</span>
            点击打开微信入群二维码
          </a>
          <p className="muted" style={{ textAlign: 'center', fontSize: '13px', lineHeight: '1.6' }}>
            在微信中打开上方链接，长按或扫描页面二维码即可加入群聊，
            <br />
            获取最新更新与交流
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
