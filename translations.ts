
export const translations = {
  zh: {
    header: {
      title: "图片转提示",
      subtitle: "上传您的图片，只需几秒钟即可将其转换为提示。",
    },
    menu: {
      imgToPrompt: "图片转提示词",
      aiPainting: "AI 绘画",
    },
    upload: {
      pageTitle: "图片转提示词",
      pageSubtitle: "上传您的图片，只需几秒钟即可将其转换为提示。",
      tabFile: "上传文件",
      tabUrl: "图片链接",
      dragDropTitle: "选择或拖拽图片至此",
      dragDropSub: "支持 JPG, PNG, WEBP",
      urlLabel: "图片 URL",
      urlPlaceholder: "https://example.com/image.jpg",
      analyzeBtn: "分析图片",
      analyzingBtn: "分析中...",
      analyzingText: "正在分析图片...",
      errorImage: "无法加载此图片（可能是因为跨域限制）。请下载图片后上传文件。",
      errorType: "请上传图片文件。",
    },
    result: {
      title: "AI 提示词",
      viewOriginal: "查看原图",
      copy: "复制",
      copied: "已复制",
      generateNext: "生成下一张",
      switchTo: "Switch to English",
      langLabel: "EN",
    },
    painting: {
      title: "AI 绘画",
      subtitle: "输入描述，AI 将为您创造出惊艳的画作。",
      placeholder: "描述您想生成的图片画面，例如：一只在霓虹灯下玩滑板的赛博朋克猫...",
      generateBtn: "生成图片",
      generatingBtn: "正在生成...",
      download: "下载图片",
      error: "生成失败，请重试。",
      resultPlaceholder: "AI 艺术作品将在此处呈现",
      settings: {
        ratio: "图片比例",
        style: "画面风格",
        model: "选择模型",
        refImage: "参考图 (可选)",
        refDrag: "点击或拖拽上传",
        random: "随机提示词",
        styles: {
          none: "默认",
          cinematic: "电影质感",
          anime: "动漫风格",
          photography: "摄影写实",
          digital: "数字艺术",
          oil: "油画风格",
          cyberpunk: "赛博朋克",
          sketch: "素描手绘"
        }
      },
      uploadRef: "上传参考图",
      removeRef: "移除",
    },
    app: {
      analysisFailed: "分析失败",
      poweredBy: "Powered by",
      rights: "All rights reserved.",
      unknownError: "发生未知错误，请稍后再试。",
    }
  },
  en: {
    header: {
      title: "Image to Prompt",
      subtitle: "Upload your image and convert it to a prompt in seconds.",
    },
    menu: {
      imgToPrompt: "Image to Prompt",
      aiPainting: "AI Painting",
    },
    upload: {
      pageTitle: "Image to Prompt",
      pageSubtitle: "Upload your image and convert it to a prompt in seconds.",
      tabFile: "Upload File",
      tabUrl: "Image URL",
      dragDropTitle: "Select or drag image here",
      dragDropSub: "Supports JPG, PNG, WEBP",
      urlLabel: "Image URL",
      urlPlaceholder: "https://example.com/image.jpg",
      analyzeBtn: "Analyze Image",
      analyzingBtn: "Analyzing...",
      analyzingText: "Analyzing image...",
      errorImage: "Cannot load image (CORS restriction). Please download and upload as file.",
      errorType: "Please upload an image file.",
    },
    result: {
      title: "AI Prompt",
      viewOriginal: "View Original",
      copy: "Copy",
      copied: "Copied",
      generateNext: "Generate Next",
      switchTo: "切换到中文",
      langLabel: "中",
    },
    painting: {
      title: "AI Painting",
      subtitle: "Enter a description and AI will create amazing art for you.",
      placeholder: "Describe the image you want to generate, e.g., A cyberpunk cat skateboarding under neon lights...",
      generateBtn: "Generate Image",
      generatingBtn: "Generating...",
      download: "Download",
      error: "Generation failed, please try again.",
      resultPlaceholder: "AI Art will appear here",
      settings: {
        ratio: "Aspect Ratio",
        style: "Art Style",
        model: "Model",
        refImage: "Reference Image (Optional)",
        refDrag: "Click or Drag & Drop",
        random: "Random Prompt",
        styles: {
          none: "Default",
          cinematic: "Cinematic",
          anime: "Anime",
          photography: "Photography",
          digital: "Digital Art",
          oil: "Oil Painting",
          cyberpunk: "Cyberpunk",
          sketch: "Sketch"
        }
      },
      uploadRef: "Upload Ref Image",
      removeRef: "Remove",
    },
    app: {
      analysisFailed: "Analysis Failed",
      poweredBy: "Powered by",
      rights: "All rights reserved.",
      unknownError: "An unknown error occurred. Please try again.",
    }
  }
};
