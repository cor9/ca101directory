import { SubmitAppConfig } from "@/types";

const enSubmitAppConfig: SubmitAppConfig = {
    title: "Submit Application",
    subtitle: "Submit your indie applications to share",
    form: {
        title: "Please enter the name and link of the app",
        name: "Name",
        namePlaceHolder: "32 characters maximum, example: ChatGPT",
        link: "Link",
        linkPlaceHolder: "app website or github repository, example: https://chatgpt.openai.com or https://github.com/openai/chatgpt",
        submit: "Submit",
        submiting: "Submiting",
        desc: "Desc",
        descPlaceHolder: "256 characters maximum, example: ChatGPT is a large language model",
        types: "Type",
        image: "Logo",
        coverImage: "Cover Image",
        update: "Update",
        updating: "Updating...",
        delete: "Delete",
        deleting: "Deleting...",
        imageUploading: "Image Uploading...",
        notice: "app will be reviewed in 24 hours",
        success: "Your application has been added.",
        error: "Something went wrong. Please try again.",
    }
}

const zhSubmitAppConfig: SubmitAppConfig = {
    title: "提交应用",
    subtitle: "提交你独立开发的应用",
    form: {
        title: "请输入应用的名称和链接",
        name: "名称",
        namePlaceHolder: "最多32个字符, 例如: ChatGPT",
        link: "链接",
        linkPlaceHolder: "应用网站或者Github链接, 例如: https://chatgpt.openai.com or https://github.com/openai/chatgpt",
        submit: "提交",
        submiting: "提交中",
        desc: "描述",
        descPlaceHolder: "最多256个字符, 例如: ChatGPT是一个大语言模型",
        types: "类型",
        image: "Logo",
        coverImage: "封面图",
        update: "更新",
        updating: "更新中...",
        delete: "删除",
        deleting: "删除中...",
        imageUploading: "图片上传中...",
        notice: "提交应用将在24小时内出结果",
        success: "您的应用已添加",
        error: "出错了, 请重试",
    }
}

export const AllSubmitAppConfigs: { [key: string]: SubmitAppConfig } = {
    en: enSubmitAppConfig,
    zh: zhSubmitAppConfig,
}