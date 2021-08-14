"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Plugin {
    async start() {
        await this.service.registerItemType("youtube-videos", {
            showInMenu: true,
            icon: 'play_circle_filled'
        });
        await this.service.registerItemTypeFields("youtube-videos", [
            {
                name: 'src',
                label: 'Video',
                mapValue: 'src',
                table: {
                    show: false,
                },
                input: {
                    type: 'video',
                    order: 1,
                    props: {
                        style: {
                            height: '500px'
                        }
                    }
                },
            },
            {
                name: 'title',
                label: 'Title',
                mapValue: 'snippet.title',
                table: {
                    order: 2,
                },
                input: {
                    position: 'sidebar',
                    order: 1,
                },
            },
            {
                name: 'description',
                label: 'Description',
                mapValue: 'snippet.description',
                table: {
                    show: false,
                },
                input: {
                    type: 'textarea',
                    order: 4,
                    props: {
                        dense: false,
                        color: "purple-12"
                    },
                },
            },
            {
                name: 'thumbnailSrc',
                label: 'Thumbnail',
                mapValue: 'snippet.thumbnails.default.url',
                table: {
                    type: 'image',
                    order: 1,
                },
                input: {
                    type: 'image',
                    position: 'sidebar',
                    order: 2,
                },
            },
            {
                name: 'replaceThumbnailSrc',
                label: 'Replace thumbnail',
                type: 'editable',
                table: {
                    type: 'image',
                    order: 1,
                    show: false
                },
                input: {
                    type: 'image',
                    position: 'sidebar',
                    order: 2,
                },
            },
            {
                name: 'publishedAt',
                label: 'Published at',
                mapValue: 'snippet.publishedAt',
                table: {
                    type: 'datetime',
                },
                input: {
                    position: 'sidebar',
                    order: 3,
                },
            },
            {
                name: 'viewCount',
                label: 'Views',
                mapValue: 'statistics.viewCount',
                table: {
                    type: 'number',
                },
                input: {
                    position: 'sidebar',
                    order: 4,
                },
            },
            {
                name: 'likeCount',
                label: 'Likes',
                mapValue: 'statistics.likeCount',
                table: {
                    type: 'number',
                },
                input: {
                    position: 'sidebar',
                    order: 4,
                },
            },
        ]);
        await this.service.registerProvider({
            name: "youtube-provider",
            path: this.service.makePluginPath("dist/videos-provider.js"),
            itemType: "youtube-videos",
            options: ['import'],
            fields: [
                {
                    name: "apiKey",
                    label: "Api key",
                },
                {
                    name: "channelId",
                    label: "Channel id",
                },
            ]
        });
    }
    async stop() {
        await this.service.unregisterItemType("youtube-videos");
        this.service.unregisterProvider("youtube-provider");
    }
}
exports.default = Plugin;
